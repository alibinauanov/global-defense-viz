import './App.css';
import { format } from 'date-fns';
import Logo from './nfactorialLogo.png';

function App() {
  let data =format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")
  
  return (
    <div className="App">
      {/* Header */}
      <div className='header'>

        <div className='logo'>
          <img src={Logo}/>;
        </div>

        <div className='data'>{data}</div>

      </div>

      {/* Images */}
      <div className='img-wrapper'>
        
        <div className='image'> 
          <div className="text">Hey</div>
          <img src="https://source.unsplash.com/gYl-UtwNg_I/1500x1500" />
        </div>

        <div className='image'> 
          <div className="text">Let's</div>
          <img src="https://source.unsplash.com/rFKUFzjPYiQ/1500x1500" />
        </div>
        
        <div className='image'> 
          <div className="text">Give</div>
          <img src="https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&w=1500&h=1500&fit=crop&s=967e8a713a4e395260793fc8c802901d" />
        </div>
     
        <div className='image'> 
          <div className="text">All</div>
          <img src="https://source.unsplash.com/ITjiVXcwVng/1500x1500" />
        </div>
     
        <div className='image'> 
          <div className="text">You can</div>
          <img src="https://source.unsplash.com/3MNzGlQM7qs/1500x1500" />
        </div>
        
      </div>

    </div>
  );
}

export default App;