# app.py - a minimal flask api using flask_restful
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.python.keras.backend import set_session
import tensorflow as tf

def mean_iou(y_true, y_pred):
        y_pred_i = tf.to_int32(y_pred > 0.5)
        y_true_i = tf.to_int32(y_true)
        intersection = tf.reduce_sum(
            tf.reduce_sum(y_pred_i*y_true_i,axis=1),axis=1
        )
        union = tf.reduce_sum(
            tf.reduce_sum(y_pred_i+y_true_i,axis=1),axis=1
        ) - intersection
        
        num_valid_entries = tf.reduce_sum(
            tf.cast(
                tf.not_equal(union, 0), dtype=tf.dtypes.float64
            )
        )
        union = tf.where(tf.greater(union, 0), union,
                                tf.ones_like(union))
        iou = tf.math.divide(intersection, union)
        mean_iou = tf.where(
            tf.greater(num_valid_entries, 0),
            tf.reduce_sum(iou, name='mean_iou') / num_valid_entries, 0
        )
        return mean_iou

class BrainMRI():
    model = None
    graph = None
    session = None

    def __init__(self):
        self.graph = tf.get_default_graph()
        self.session = tf.Session()
        set_session(self.session)
        self.model = load_model("model_brain_segment.h5", custom_objects={'mean_iou': mean_iou})
        self.model._make_predict_function()
        
    def predictImage(self,filename):
        img = Image.open(filename).convert('L')
        img = img.resize((128,128))
        nparr = np.array(img)
        nparr = nparr/255.
        nparr = np.expand_dims(nparr,axis=0)
        nparr = np.expand_dims(nparr,axis=3)
        with self.graph.as_default():
            set_session(self.session)
            predict_val = self.model.predict(nparr)
            predict_val = (predict_val>0.5).astype(np.uint8)
            predict_val = predict_val*255
        resp_img = Image.fromarray(predict_val[0].reshape(128,128),mode='L').convert('1')
        print(np.where(predict_val[0]==255))
        return resp_img
