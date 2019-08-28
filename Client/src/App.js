import React, {useState} from 'react';
import {hot} from 'react-hot-loader';

import ButtonGroup from './ButtonGroup';
import UTIF from 'utif';
import { Stage, Layer, Image } from 'react-konva';
import './styles.css';

/**
* App - Main entry point that hosts other components
*/
const App = () => {
	/** States to set mask image and source image using hooks **/
  	const [maskUrl, setMaskUrl] = useState('');
  	const [srcImage, setSrcImage] = useState('');
  	
  	/** URL of API **/
  	let url = "http://64.62.255.128:5000/mask";

	/**
	* sendFileForPrediction sends image file to
	* API using POST. It receives Mask file as Blob
	* And sets the Mask image flag 
	* it out
	*/
	const sendFileForPrediction = files => {
		
		const data = new FormData();
    	
    	data.append('file', files[0]);
    	data.append('filename', 'brainmriimage');
	    fetch(url, {
	    	method: "POST",
	    	body: data
	    })
	      .then(response => response.blob())
	      .then(res => {
	      	
	      	let maskurl = window.URL.createObjectURL(res)
	      	setMaskUrl(maskurl)
			
		})
	};

	/**
	* showSourceImage is called when a new image is selected by the user
	* This uses UTIF library to convert TIFF image to a displayable canvas of size 128 x 128
	* This sets the Image flag and unsets the mask flag.
	* UTIF contributed by https://github.com/photopea/UTIF.js
	*/

	const showSourceImage = filename => {
		const xhr = new XMLHttpRequest();
    	xhr.open('GET', URL.createObjectURL(filename));
    
    	xhr.responseType = 'arraybuffer';
    	xhr.onload = e => {
      		const ifds = UTIF.decode(e.target.response);
      		UTIF.decodeImage(e.target.response, ifds[0]);
      		const firstPageOfTif = ifds[0];
      		const rgba = UTIF.toRGBA8(firstPageOfTif);

      		const imageWidth = firstPageOfTif.width;
      		const imageHeight = firstPageOfTif.height;
      		console.log(firstPageOfTif)
     		const bigcnv = document.createElement('canvas');
      		bigcnv.width = imageWidth;
      		bigcnv.height = imageHeight;

      		const bigctx = bigcnv.getContext('2d');
      		const imageData = bigctx.createImageData(imageWidth, imageHeight);
      		for (let i = 0; i < rgba.length; i++) {
        		imageData.data[i] = rgba[i];
      		}
      		bigctx.putImageData(imageData,0,0)
      		const smallcnv = document.createElement('canvas');
      		smallcnv.width = 128;
      		smallcnv.height = 128;
      		const smallctx = smallcnv.getContext('2d');
      		smallctx.scale(128/imageWidth,128/imageHeight);
      		smallctx.drawImage(bigcnv, 0, 0);

      		setSrcImage(smallcnv)
    	};
    	xhr.send();

	    setMaskUrl('')
		
		
	};

	/***
	* The actual rendering part. The callback methods are sent as props to ButtonGroup
	* Two blocks are reserved for the display of actual image and the mask
	**/
	
	 return (	
		  	<div>
		    	<ButtonGroup predictCallback={sendFileForPrediction} showImageCallback={showSourceImage}/>
		    	<div className='parent'>
			    	<Stage width='128' height='128'>
	        			<Layer>
	          				<Image image={srcImage} />
	        			</Layer>
	      			</Stage>
	      			<div className='imageClass'>
			    			<img src={maskUrl} />
			    	</div>
			    </div>
		  	</div>
	 );
		
	
}

export default hot(module)(App);
