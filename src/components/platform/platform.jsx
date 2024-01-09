import React, { useState } from 'react';
import "./platform.css"
import Button from '../button/button';
import Modal from '../modal/modal';
import Input from '../input/input';
import DateInput from '../input/dataInput'

const Platform = ({data}) => {
  // открытие модальных окон 
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteApplication, setDeleteApplication] = useState(false);
  const [isDeleteBillboard, setDeleteBillboard] = useState(false);
  const [isChangeApplication, setChangeApplication] = useState(false);
  const [isChangeBillboard, setChangeBillboard] = useState(false);
  const [isAddApplication, setAddApplication] = useState(false);
  const togglePlatform = () => {
    setIsOpen(!isOpen);
  };

  // общие данные
  const [applicationId, setApplicationId] = useState("")
  const [customer, setCustomer] = useState("")
  const [beginData, setBeginData] = useState("")
  const [endData, setEndData] = useState("")
  const [address, setAddress] = useState("")

  const sortedApplications = [...data.applications].sort(
    (a, b) => new Date(a.begin_data) - new Date(b.begin_data)
  );

  const handleDeleteBillboard = () => {
  };

  const handleDeleteApplication = () => {
  };

  const handleChangeBillboard = () => {
  }

  const createApplication = () => {
  }

  return (
    <div className="platform">
      <div className={`platform-header ${isOpen ? 'open' : ''}`} onClick={togglePlatform}>
        <h3>{data.address}</h3>
        <div className='billboard-right'>
          <div className="billboard-id">ID: {data.id}</div>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
        </div>
      </div>
      {isOpen && (
        <div className="platform-content">
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
                      setBeginData(application.begin_data),
                      setEndData(application.end_data)
                    )}>
                      <i class="fa fa-edit" style={{color: "white"}}></i>
                    </Button> 
                    <Button onClick={() => (
                      setDeleteApplication(true),
                      setApplicationId(application.id)
                    )} type={"danger"}>
                      <i class="fa fa-remove" style={{color: "white"}}></i>
                    </Button>      
                  </td>
                </tr>
              ))}    
            </tbody>
          </table>
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
              <Button onClick={() => handleDeleteBillboard()} type={"danger"}>удалить</Button>
            </div>
          </Modal>
          <Modal isOpen={isDeleteApplication} onClose={() => setDeleteApplication(false)} title={"Вы уверены, что хотите удалить заказ?"}>
            <div>это повлечёт удаление всех его данных</div>
            <div className="platform-bottom">
              <Button onClick={() => setDeleteApplication(false)}>отмена</Button>
              <Button onClick={() => handleDeleteApplication()} type={"danger"}>удалить</Button>
            </div>
          </Modal>
          <Modal isOpen={isChangeApplication} onClose={() => setChangeApplication(false)} title={"Редактирование заказа"}>
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
              <Button onClick={() => setAddApplication(false)} type={"default"}>отмена</Button>
              <Button onClick={() => createApplication()}>подтвердить</Button>
            </div>
          </Modal>
          <Modal isOpen={isChangeBillboard} onClose={() => setChangeBillboard(false)} title={"Редактирование билборда"}>
            <div className="platform-bottom">  
              <div>
                Адрес: <Input input={(value) => setAddress(value)} placeholder={data.address}/>
              </div>
              <Button onClick={() => handleChangeBillboard()}>подтвердить</Button>
            </div>
          </Modal>
          <Modal isOpen={isAddApplication} onClose={() => setAddApplication(false)} title={"Создание заказа"}>
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
              <Button onClick={() => setAddApplication(false)} type={"default"}>отмена</Button>
              <Button onClick={() => createApplication()}>подтвердить</Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Platform;
