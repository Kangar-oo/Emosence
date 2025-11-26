import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator

MODEL_PATH = 'emosense_cnn.h5'
TEST_DIR = '../dataset/test'

def evaluate():
    if not os.path.exists(MODEL_PATH):
        print("❌ Model not found. Train it first!")
        return

    model = tf.keras.models.load_model(MODEL_PATH)
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    test_generator = test_datagen.flow_from_directory(
        TEST_DIR, target_size=(48, 48), batch_size=64,
        color_mode='grayscale', class_mode='categorical', shuffle=False
    )

    print("⏳ Evaluating model accuracy...")
    loss, accuracy = model.evaluate(test_generator)
    print(f"🎯 Final Test Accuracy: {accuracy * 100:.2f}%")

if __name__ == "__main__":
    import os
    evaluate()