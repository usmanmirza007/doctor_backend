from PIL import Image
import sys
import os

def images_to_pdf(image_paths, output_pdf_path):
    try:
        # Ensure at least one image is provided
        if not image_paths:
            print("Error: No image paths provided.")
            return

        # Ensure all image paths exist
        for image_path in image_paths:
            if not os.path.exists(image_path):
                print(f"Error: Image file '{image_path}' does not exist.")
                return

        # Open the first image and convert it to RGB
        first_image = Image.open(image_paths[0]).convert('RGB')

        # Open and convert remaining images to RGB
        additional_images = [Image.open(img).convert('RGB') for img in image_paths[1:]]

        # Save all images to a single PDF
        first_image.save(output_pdf_path, save_all=True, append_images=additional_images)
        print(f"PDF created successfully at {output_pdf_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python image_to_pdf.py <output_pdf_path> <image1> [<image2> ...]")
        sys.exit(2)

    output_pdf_path = sys.argv[1]
    image_paths = sys.argv[2:]
    print('testing 0', output_pdf_path, image_paths)

    # Check if all image paths exist
    for image_path in image_paths:
        print('image_path', image_path)
        if not os.path.exists(image_path):
            print("Error: Image file '{image_path}' does not exist.")
            sys.exit(2)

    print('testing 1' , output_pdf_path, image_paths)
    images_to_pdf(image_paths, output_pdf_path)
