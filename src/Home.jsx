import React, {useState} from 'react'

const Home = () => {
    const [file, setFile] = useState(null);

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = () => {
        
    }

    return (
        <div className='container'>
            <input type="file" onChange={handleFile} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default Home
