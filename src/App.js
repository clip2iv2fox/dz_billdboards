import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Header from './components/header/header';
import Platform from './components/platform/platform';
import Modal from './components/modal/modal';
import Input from './components/input/input';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAddres, setNewAddres] = useState("")
  const [data, setData] = useState([
    {
      id: "billboard-1",
      address: "Ленинский проспект 39/1",
      applications: [
        {
          id: "application-1",
          name: "Аквариус",
          begin_data: "10",
          end_data: "12",
        }
      ]
    }
  ])

  useEffect(() => {
    
  }, []);

  const handleCreateBillboard = () => {
    setModalOpen(false);
  };

  return (
    <div className="App">
      <Header/>
      {data.map((billboard)=>
        <Platform data={billboard}/>
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
