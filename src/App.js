import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Header from './components/header/header';
import Platform from './components/platform/platform';
import Modal from './components/modal/modal';
import Input from './components/input/input';
import axios from 'axios';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAddres, setNewAddres] = useState("")
  const [data, setData] = useState([])

  const getData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/billboards');
        console.log('Успешно получены билборды:', response.data);
        setData(response.data)
    } catch (error) {
        console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    getData()
  }, []);

  const handleCreateBillboard = async () => {
    setModalOpen(false);
    try {
      const response = await axios.post('http://localhost:5000/api/billboards', {
        address: newAddres,
        min: 10,
        max: 20,
      });

      setData(response.data);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteBillboard = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/billboards/${id}`)

      setData(response.data);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="App">
      <Header/>
      {data.map((billboard)=> 
        <Platform data={billboard} handleDeleteBillboard={(id) => handleDeleteBillboard(id)}/>
      )}
      <div className='billboard-button'>
        <Button onClick={() => setModalOpen(true)}>+ билборд</Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={"Создание билборда"}>
        <div className="platform-bottom">  
          <div>
            Адрес: 
            <Input input={(value) => setNewAddres(value)} placeholder="ввод..."/>
          </div>
        </div>
        <div className="platform-bottom">
          <Button onClick={() => setModalOpen(false)} type={"default"}>отмена</Button>
          <Button onClick={() => handleCreateBillboard()}>подтвердить</Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
