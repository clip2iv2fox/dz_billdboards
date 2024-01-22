import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Header from './components/header/header';
import Platform from './components/platform/platform';
import Modal from './components/modal/modal';
import Input from './components/input/input';
import NumInput from './components/input/numInput';
import axios from 'axios';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAddres, setNewAddres] = useState("")
  const [data, setData] = useState([])
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [notification, setNotification] = useState("")
  const [reloadApplications, setReloadApplications] = useState(true)

  const getData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/billboards');
        console.log('Успешно получены билборды:', response.data);
        setData(response.data)
    } catch (error) {
        console.error('Ошибка:' + error);
    }
  };

  useEffect(() => {
    getData()
  }, []);

  const handleCreateBillboard = async () => {
    if (newAddres == "" || min == "" || max == "") {
      setNotification("Введены не все данные.")
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/billboards', {
          address: newAddres,
          min: min,
          max: max,
        });

        setData(response.data);
        setNotification("")
        setNewAddres("")
        setMin("")
        setMax("")
        setModalOpen(false);
      } catch (error) {
        console.error('Ошибка:' + error);
        setNotification('Ошибка:' + error)
      }
    }
  };

  const handleDeleteBillboard = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/billboards/${id}`)

      setData(response.data);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const modalClose = () => {
    setModalOpen(false)
    setNotification("")
    setNewAddres("")
    setMin("")
    setMax("")
  }

  return (
    <div className="App">
      <Header/>
      {data.map((billboard)=> 
        <Platform 
          data={billboard}
          billboards={data}
          handleDeleteBillboard={(id) => handleDeleteBillboard(id)}
          reloadBillboards={() => getData()}
          reload = {reloadApplications}
          handleReload = {() => setReloadApplications(!reloadApplications)}
        />
      )}
      <div className='billboard-button'>
        <Button onClick={() => setModalOpen(true)}>+ билборд</Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => modalClose(false)} title={"Создание билборда"}>
        <div className="platform-bottom">
          <div>
            Адрес: 
            <Input input={(value) => setNewAddres(value)} placeholder="ввод..."/>
          </div>
          <div>
            min: 
            <NumInput input={(value) => setMin(value)} min={1} max={max} placeholder="ввод..."/>
          </div>
          <div>
            max: 
            <NumInput input={(value) => setMax(value)} min={min} placeholder="ввод..."/>
          </div>
        </div>
        <div className="platform-bottom">
          <Button onClick={() => modalClose()} type={"default"}>отмена</Button>
          <div className='notification'>{notification}</div>
          <Button onClick={() => handleCreateBillboard()}>подтвердить</Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
