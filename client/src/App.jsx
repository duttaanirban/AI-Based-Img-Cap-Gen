import { useState } from 'react';
import './index.css';

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return alert('Please upload an image.');

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/caption', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setCaption(data.caption || data.error || 'Something went wrong');
    } catch (err) {
      console.error(err);
      setCaption('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-950'>
      <h1 className='text-white font-bold text-3xl'>🧠 Image Caption Generator</h1>
      <div className='bg-gray-800 p-6 h-96 rounded shadow-md flex flex-col items-center mt-4'>
      <input type="file" accept="image/*" onChange={handleImageChange} className='bg-white'/>
      <button onClick={handleSubmit} disabled={loading} className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
      {caption && <p><strong>Caption:</strong> {caption}</p>}
      </div>
    </div>
  );
}

export default App;

