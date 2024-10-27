// import React from 'react';


// import image1 from '../assets/image1.jpeg';
// import image2 from '../assets/image2.jpeg';
// import image3 from '../assets/image3.jpeg';
// import image4 from '../assets/image4.jpeg';
// import image5 from '../assets/image5.jpeg';
// import image6 from '../assets/image6.jpeg';
// import image7 from '../assets/image7.jpeg';
// import image8 from '../assets/image8.jpeg';
// import image9 from '../assets/image9.jpeg';

// const images = [

//     { src: image1, size: 'large' },
//     { src: image2, size: 'small' },
//     { src: image3, size: 'small' },
//     { src: image4, size: 'large' },
//     { src: image5, size: 'small' },
//     { src: image6, size: 'small' },
//     { src: image7, size: 'large' },
//     { src: image8, size: 'small' },
//     { src: image9, size: 'small' },
// ];

// const Home = () => {
//     return (
//         <div>
//             <h1>Welcome to the Home Page!</h1>
//             <div className="Grid_Container">
//                 {images.map((img, index) => (
//                     <div className={'grid-item ${img.size}'} key={index}>
//                         <img src={img.src} alt={`Image ${index}`} className="grid-image" />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Home;


import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <div className="Grid_Container">
            {/* Large Circular Div */}
            <div className="large-div">
                <h2>Circle</h2>
            </div>

            {/* Container for Small Divs */}
            <div className="small-div-container">
                <div className="small-div">Small Div 1</div>
                <div className="small-div">Small Div 2</div>
                <div className="small-div">Small Div 3</div>
                <div className="small-div">Small Div 4</div>
            </div>
        </div>
        </div>
    );
};

export default Home;
