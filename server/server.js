const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

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
Billboard.hasMany(Application, { foreignKey: 'billboardId' });
Application.belongsTo(Billboard, { foreignKey: 'billboardId' });

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

        Application.create({
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

        // Обновляем поля заказа
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

        // Получаем обновленный заказ
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