const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Определение моделей
const Billboard = sequelize.define('Billboard', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    min: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    begin_data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    end_data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Определение ассоциаций
Billboard.hasMany(Application, {
    foreignKey: 'billboardId',
    onDelete: 'CASCADE',
});
Application.belongsTo(Billboard, {
    foreignKey: 'billboardId',
    onDelete: 'CASCADE',
});


// Создать таблицы, если их нет
Billboard.sync();
Application.sync();

//////////////////////////////////////////////////////////////
// билборды
app.post('/api/billboards', async (req, res) => {
    try {
        const { address, min, max } = req.body;
        Billboard.create({
            address: address || 'неизвестен',
            min: min || 1,
            max: max || 10,
        });
        
        const allBillboards = await Billboard.findAll();
        res.json(allBillboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.get('/api/billboards', async (req, res) => {
    try {
        const allBillboards = await Billboard.findAll();
        res.json(allBillboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения данных из базы данных' });
    }
});

app.delete('/api/billboards/:billboardId', async (req, res) => {
    try {
        const billboardId = req.params.billboardId;

        // Проверяем, существует ли билборд с указанным ID
        const billboardToDelete = await Billboard.findByPk(billboardId);

        if (!billboardToDelete) {
            return res.status(404).json({ error: 'Билборд не найден' });
        }

        // Удаляем билборд
        await billboardToDelete.destroy({ include: Application });

        // Получаем все Billboard из базы данных после удаления
        const allBillboards = await Billboard.findAll();
        
        // Отправляем все Billboard в виде ответа на запрос
        res.json(allBillboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления билборда' });
    }
});

app.put('/api/billboards/:billboardId', async (req, res) => {
    try {
        const billboardId = req.params.billboardId;
        const { address } = req.body;

        // Проверяем, существует ли билборд с указанным ID
        const billboardToUpdate = await Billboard.findByPk(billboardId);

        if (!billboardToUpdate) {
            return res.status(404).json({ error: 'Билборд не найден' });
        }

        // Обновляем поле address билборда
        await billboardToUpdate.update({ address });

        // Получаем обновленный билборд
        const updatedBillboard = await Billboard.findByPk(billboardId);

        res.json(updatedBillboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления билборда' });
    }
});

// заявки
app.get('/api/applications/:billboardId', async (req, res) => {
    try {
        const billboardId = req.params.billboardId;

        // Проверяем, существует ли билборд с указанным ID
        const billboard = await Billboard.findByPk(billboardId);

        if (!billboard) {
            return res.status(404).json({ error: 'Билборд не найден' });
        }

        // Получаем все заявки для указанного билборда
        const applicationsForBillboard = await Application.findAll({
            where: { billboardId },
        });

        res.json(applicationsForBillboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения заявок для билборда' });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const { name, begin_data, end_data, billboardId } = req.body;

        // Поиск билборда по адресу
        const billboard = await Billboard.findByPk(billboardId);

        if (!billboard) {
            return res.status(404).json({ error: 'Билборд не найден' });
        }

        const minDays = billboard.min;
        const maxDays = billboard.max;

        const beginDate = new Date(begin_data);
        const endDate = new Date(end_data);

        const daysDifference = Math.floor((endDate - beginDate) / (24 * 60 * 60 * 1000)) + 1;

        if (daysDifference < minDays || daysDifference > maxDays) {
            return res.status(400).json({ error: `Количество дней должно быть от ${minDays} до ${maxDays}` });
        }

        // Проверка на пересечение существующих заказов
        const existingApplications = await Application.findAll({
            where: {
                billboardId,
                [Op.or]: [
                    {
                        begin_data: {
                            [Op.between]: [begin_data, end_data],
                        },
                    },
                    {
                        end_data: {
                            [Op.between]: [begin_data, end_data],
                        },
                    },
                    {
                        [Op.and]: [
                            {
                                begin_data: {
                                    [Op.lte]: begin_data,
                                },
                            },
                            {
                                end_data: {
                                    [Op.gte]: end_data,
                                },
                            },
                        ],
                    },
                ],
            },
        });

        if (existingApplications.length > 0) {
            return res.status(400).json({ error: 'Даты заказов пересекаются' });
        }

        // Если нет пересечений, создаем заказ
        const newApplication = await Application.create({
            name: name,
            begin_data: begin_data,
            end_data: end_data,
            billboardId: billboardId,
        });

        res.json(newApplication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания заявки' });
    }
});

app.delete('/api/applications/:billboardId/:applicationId', async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const billboardId = req.params.billboardId;

        const applicationToDelete = await Application.findByPk(applicationId);

        if (!applicationToDelete) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        await applicationToDelete.destroy();

        const applicationsForBillboard = await Application.findAll({
            where: { billboardId },
        });

        res.json(applicationsForBillboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заявки' });
    }
});

app.put('/api/applications/:applicationId', async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const { name, begin_data, end_data, billboardId } = req.body;

        // Поиск билборда по адресу
        const billboard = await Billboard.findByPk(billboardId);

        if (!billboard) {
            return res.status(404).json({ error: 'Билборд не найден' });
        }

        const minDays = billboard.min;
        const maxDays = billboard.max;

        const beginDate = new Date(begin_data);
        const endDate = new Date(end_data);

        const daysDifference = Math.floor((endDate - beginDate) / (24 * 60 * 60 * 1000)) + 1;

        if (daysDifference < minDays || daysDifference > maxDays) {
            return res.status(400).json({ error: `Количество дней должно быть от ${minDays} до ${maxDays}` });
        }

        // Проверка на пересечение существующих заказов
        const existingApplications = await Application.findAll({
            where: {
                billboardId,
                [Op.or]: [
                    {
                        begin_data: {
                            [Op.between]: [begin_data, end_data],
                        },
                    },
                    {
                        end_data: {
                            [Op.between]: [begin_data, end_data],
                        },
                    },
                    {
                        [Op.and]: [
                            {
                                begin_data: {
                                    [Op.lte]: begin_data,
                                },
                            },
                            {
                                end_data: {
                                    [Op.gte]: end_data,
                                },
                            },
                        ],
                    },
                ],
                id: {
                    [Op.ne]: applicationId,
                },
            },
        });

        if (existingApplications.length > 0) {
            return res.status(400).json({ error: 'Даты заказов пересекаются' });
        }

        const applicationToUpdate = await Application.findByPk(applicationId);

        if (!applicationToUpdate) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }

        await applicationToUpdate.update({
            name: name,
            begin_data: begin_data,
            end_data: end_data,
            billboardId: billboardId,
        });

        const applicationsForBillboard = await Application.findAll({
            where: { billboardId },
        });

        res.json(applicationsForBillboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления заказа' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});