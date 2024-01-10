import React, { useEffect, useState } from 'react';
import "./platform.css"
import Button from '../button/button';
import Modal from '../modal/modal';
import Input from '../input/input';
import DateInput from '../input/dataInput'
import axios from 'axios';
import NumInput from '../input/numInput';
import Select from '../select/select';

const Platform = ({data, billboards, handleDeleteBillboard, reloadBillboards}) => {
  // открытие модальных окон 
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteApplication, setDeleteApplication] = useState(false);
  const [isDeleteBillboard, setDeleteBillboard] = useState(false);
  const [isChangeApplication, setChangeApplication] = useState(false);
  const [isChangeBillboard, setChangeBillboard] = useState(false);
  const [isAddApplication, setAddApplication] = useState(false);
  const [applications, setApplications] = useState([])
  const togglePlatform = () => {
    setIsOpen(!isOpen);
  };

  // общие данные
  const [applicationId, setApplicationId] = useState("")
  const [billboardId, setBillboardId] = useState("")
  const [customer, setCustomer] = useState("")
  const [beginData, setBeginData] = useState("")
  const [endData, setEndData] = useState("")
  const [address, setAddress] = useState("")
  const [notification, setNotification] = useState("")

  const sortedApplications = Array.isArray(applications) ? [...applications].sort(
    (a, b) => new Date(a.begin_data) - new Date(b.begin_data)
  ) : [];

  useEffect(() => {
    getApplications()
  }, []);

  useEffect(() => {
    setNotification("")
  }, [
    isDeleteApplication,
    isDeleteBillboard,
    isChangeApplication,
    isChangeBillboard,
    isAddApplication,
  ]);

  const getApplications = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/applications/${data.id}`);
        console.log('Успешно получены заказы:', response.data);
        setApplications(response.data)
    } catch (error) {
      setNotification('Ошибка сервера', error);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/applications/${data.id}/${applicationId}`)

      setDeleteApplication(false)
      setApplications(response.data);
    } catch (error) {
      setNotification('Ошибка сервера', error);
    }
  };

  const handleChangeBillboard = async () => {
    if (address == "") {
      setNotification("Введены не все данные.")
    } else {
      try {
        const response = await axios.put(`http://localhost:5000/api/billboards/${data.id}`, {
          address: address
        });
        
        setAddress("")
        setChangeBillboard(false)

        reloadBillboards()
      } catch (error) {
        setNotification('Ошибка сервера', error)
      }
    }
  }

  const handleChangeApplication = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/applications/${applicationId}`, {
        name: customer,
        begin_data: beginData,
        end_data: endData,
        billboardId: billboardId
      });
      
      setAddress("")
      setChangeApplication(false)
      setApplications(response.data)
      reloadBillboards()
    } catch (error) {
      setNotification('Ошибка сервера', error)
    }
  }

  const createApplication = async () => {
    if (customer == "" || beginData == "" || endData == "") {
      setNotification("Введены не все данные.")
    } else {
      try {
          const response = await axios.post('http://localhost:5000/api/applications', {
            name: customer,
            begin_data: beginData,
            end_data: endData,
            billboardId: data.id,
          });
          setAddApplication(false)
          console.log('Успешно создан заказ:', response.data);
          setAddApplication(false)
          setCustomer("")
          setBeginData("")
          setEndData("")
          setApplications(response.data)
      } catch (error) {
        setNotification('Ошибка сервера', error)
      }
    }
  }

  const table = () => {
    return(
    <table className='application-table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>заказчик</th>
          <th>начало</th>
          <th>конец</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedApplications.map((application) => (
          <tr key={application.id}>
            <td>{application.id}</td>
            <td>{application.name}</td>
            <td>{application.begin_data}</td>
            <td>{application.end_data}</td>
            <td>
              <Button onClick={() => (
                setChangeApplication(true),
                setApplicationId(application.id),
                setCustomer(application.name),
                setBeginData(application.begin_data),
                setEndData(application.end_data),
                setBillboardId(data.id)
              )}>
                <i className="fa fa-edit" style={{color: "white"}}></i>
              </Button>
              <Button onClick={() => (
                setDeleteApplication(true),
                setApplicationId(application.id)
              )} type={"danger"}>
                <i className="fa fa-remove" style={{color: "white"}}></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    )
  }

  return (
    <div className="platform">
      <div className={`platform-header ${isOpen ? 'open' : ''}`} onClick={togglePlatform}>
        <h3>
          {data.address}
          <div className="billboard-id">min-max: {data.min} - {data.max}</div>
        </h3>
        <div className='billboard-right'>
          <div className="billboard-id">ID: {data.id}</div>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
        </div>
      </div>
      {isOpen && (
        <div className="platform-content">
          {
            sortedApplications.length === 0 ? (
              <div className='no-applications'>ЗАКАЗОВ НЕТ</div>
            ) : (
              table()
            )
          }
          <div className="platform-bottom">
            <div>
              <Button onClick={() => (setChangeBillboard(true))} type={"default"}>редактировать билборд</Button>
              <Button onClick={() => setAddApplication(true)}>+ заказ</Button>
            </div>
            <Button onClick={() => setDeleteBillboard(true)} type={"danger"}>удалить</Button>
          </div>
          <Modal isOpen={isDeleteBillboard} onClose={() => setDeleteBillboard(false)} title={"Вы уверены, что хотите удалить билборд?"}>
            <div>это повлечёт удаление его данных и данных заказа</div>
            <div className="platform-bottom">
              <Button onClick={() => setDeleteBillboard(false)}>отмена</Button>
              <div className='notification'>{notification}</div>
              <Button onClick={() => (handleDeleteBillboard(data.id), setDeleteBillboard(false))} type={"danger"}>удалить</Button>
            </div>
          </Modal>
          <Modal isOpen={isDeleteApplication} onClose={() => setDeleteApplication(false)} title={"Вы уверены, что хотите удалить заказ?"}>
            <div>это повлечёт удаление всех его данных</div>
            <div className="platform-bottom">
              <Button onClick={() => setDeleteApplication(false)}>отмена</Button>
              <div className='notification'>{notification}</div>
              <Button onClick={() => handleDeleteApplication()} type={"danger"}>удалить</Button>
            </div>
          </Modal>
          <Modal isOpen={isChangeApplication} onClose={() => (setChangeApplication(false), setCustomer(""), setBeginData(""), setEndData(""))} title={"Редактирование заказа"}>
            <div className="platform-bottom">  
              <div>
                Заказчик: 
                <Input input={(value) => setCustomer(value)} placeholder={customer}/>
              </div>
              <div>
                Билборд: 
                <Select options={billboards} onSelect={(value) => setBillboardId(value)} placeholder={data.address}/>
              </div>
            </div>
            <div className="platform-bottom">  
              <div>
                Даты:
              </div>
              <div>
                начало
                <DateInput input={(value) => setBeginData(value)} placeholder={beginData}/>
              </div>
              <div>
                -
              </div>
              <div>
                конец
                <DateInput input={(value) => setEndData(value)} placeholder={endData}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => handleChangeApplication()}>подтвердить</Button>
            </div>
          </Modal>
          <Modal isOpen={isChangeBillboard} onClose={() => (setChangeBillboard(false), setAddress(""))} title={"Редактирование билборда"}>
            <div className="platform-bottom">  
              <div>
                Адрес: <Input input={(value) => setAddress(value)} placeholder={data.address}/>
              </div>
              <div className='notification'>{notification}</div>
              <Button onClick={() => (handleChangeBillboard())}>подтвердить</Button>
            </div>
          </Modal>
          <Modal isOpen={isAddApplication} onClose={() => (setAddApplication(false), setCustomer(""), setBeginData(""), setEndData(""))} title={"Создание заказа"}>
            <div className="platform-bottom">  
              <div>
                Заказчик: 
                <Input input={(value) => setCustomer(value)} placeholder="ввод..."/>
              </div>
            </div>
            <div className="platform-bottom">  
              <div>
                Даты:
              </div>
              <div>
                начало
                <DateInput input={(value) => setBeginData(value)}/>
              </div>
              <div>
                -
              </div>
              <div>
                конец
                <DateInput input={(value) => setEndData(value)}/>
              </div>
            </div>
            <div className="platform-bottom">
              <Button onClick={() => (setAddApplication(false), setCustomer(""), setBeginData(""), setEndData(""))} type={"default"}>отмена</Button>
              <div className='notification'>{notification}</div>
              <Button onClick={() => createApplication()}>подтвердить</Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Platform;
