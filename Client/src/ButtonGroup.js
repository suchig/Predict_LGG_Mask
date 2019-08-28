import React from 'react';
import './styles.css';


/**
* ButtonBox component that holds buttons to choose image file and predict mask
*/
export default class ButtonGroup extends React.Component {

  
  render() {
    //Get the callbacks as props from Parent
    const {predictCallback, showImageCallback} = this.props;

    /** handleSubmit is called when Submit button is clicked
    * This in turn calls predict callback in parent with file chosen as argument
    **/
    const handleSubmit = e => {
      
      const files = e.target.elements["fileupload"].files;
      predictCallback(files);
      e.preventDefault();
      
    }
  
    /** showImage is called when a new Image is chosen.
     *  This calls callback to parent to display the image
     **/
    const showImage = e => {
      
      const file = e.target.files[0];
      showImageCallback(file);
      
    }

    /** handleClick is a helper function. This is called when the "helper" button is clicked
     *  The actual fileupload is hidden for aesthetic reasons. 
     *  Th is method triggers a click of file dialog button when user clicks the helper button
     **/
    const handleClick = e => {
      document.getElementById("fileupload").click();
      e.preventDefault();
      
    }

    /** The portion that renders three buttons
     * 1. File upload - This is invisible for aesthetic reasons. Used to select the source image
     * 2. helper button - This acts in lieu of File dialog and kicks a file dialog action when user clicks
     * 3. Submit button - This submits the image file for prediction.
     **/
    return(
    <form onSubmit={handleSubmit}>
      
      <h2>Brain Low Grade Glioma Mask Identification</h2>
     
      <div className="parent">
        <input type="file"  name="fileupload" id="fileupload" style={{display: "none"}} onChange={showImage} />
        <input type="button" name="helper" className="button" value="Choose an LGG image" onClick={handleClick}/>
        <div className="predict">
          <input  name="Submit" type="submit" className="button" value="Predict Mask" />
        </div>
      </div>

    </form>
      );
  }
}
