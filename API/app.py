# app.py - a minimal flask api using flask_restful
from flask import Flask, request, make_response
from flask_restful import reqparse,Resource, Api
from BrainMRI import BrainMRI
from flask import send_file
from PIL import Image


app = Flask(__name__)
api = Api(app)
brainmri = BrainMRI()
print("Init done")

class Interaction(Resource):
    def post(self):
    	image_file = request.files['file']
    	image_name = image_file.filename
    	image_file.save("data/"+image_name)
    	predict_img = brainmri.predictImage("data/"+image_name)
  
    	response_file_name = image_name.split('.')[0]+"conv_mask.png"
    	predict_file = predict_img.save("data/"+response_file_name)
    	origin = request.environ['HTTP_ORIGIN']

    	response = send_file("data/"+response_file_name, as_attachment=True, attachment_filename=response_file_name)
    	response.headers.set('Content-Type', 'image/png')
    	h = response.headers
    	h['Access-Control-Allow-Origin'] = origin
    	
    	response.headers = h
    	return response
    	

api.add_resource(Interaction, '/mask')

if __name__ == '__main__':

    app.run(debug=False, host='0.0.0.0')