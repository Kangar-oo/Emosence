import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
# UPDATED IMPORT: Specifically pulling from tensorflow.keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
import os

# === CONFIGURATION ===
# Ensure your dataset is at emosense-local/dataset/train
TRAIN_DIR = '../dataset/train'
TEST_DIR = '../dataset/test'
IMG_SIZE = (48, 48)
BATCH_SIZE = 64
EPOCHS = 30 

def train_cnn():
    if not os.path.exists(TRAIN_DIR):
        print(f"❌ Error: Dataset not found at {TRAIN_DIR}")
        print("Please ensure you downloaded FER-2013 and extracted it to the 'dataset' folder.")
        return

    # Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255, 
        rotation_range=15, 
        zoom_range=0.15,
        horizontal_flip=True, 
        fill_mode='nearest'
    )
    val_datagen = ImageDataGenerator(rescale=1./255)

    print("⏳ Loading dataset...")
    try:
        train_generator = train_datagen.flow_from_directory(
            TRAIN_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
            color_mode='grayscale', class_mode='categorical'
        )
        validation_generator = val_datagen.flow_from_directory(
            TEST_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
            color_mode='grayscale', class_mode='categorical'
        )
    except Exception as e:
        print(f"❌ Data Loading Error: {e}")
        return

    # Build CNN Architecture
    model = Sequential([
        # Block 1
        Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),

        # Block 2
        Conv2D(64, (3, 3), activation='relu'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),

        # Block 3
        Conv2D(128, (3, 3), activation='relu'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        Dropout(0.25),

        # Dense Layers
        Flatten(),
        Dense(256, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(7, activation='softmax')
    ])

    model.compile(optimizer=Adam(learning_rate=0.0001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])

    print("🚀 Starting Training... (Press Ctrl+C to stop early)")
    model.fit(train_generator, epochs=EPOCHS, validation_data=validation_generator)

    model.save('emosense_cnn.h5')
    print("✅ Model saved as 'emosense_cnn.h5'")

if __name__ == "__main__":
    train_cnn()