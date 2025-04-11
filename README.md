# Student ID Card Generator

This is a React-based Student ID Card Generator that allows users (for example, school administrators or students) to enter student data, preview a smart ID card with a QR code, and download the generated card as a PNG image. The project is styled using standard CSS (no Tailwind CSS), and it includes features like template switching and persistent card storage via localStorage.

## Features

- **Student Data Form:**  
  Capture student details such as:
  - Name
  - Roll Number
  - Class & Division (dropdown)
  - Allergies (multi-select)
  - Photo Upload (with preview)
  - Rack Number (an identifier typically used to denote storage or seating assignments)
  - Bus Route Number (dropdown)

- **Smart ID Card Preview:**  
  Generates a preview of the ID card displaying:
  - Student information and photo
  - List of allergies (if any)
  - Rack number and bus route
  - A QR code that encodes a sanitized version of the student data (excluding large fields like the photo) with an adjustable error correction level

- **Download Functionality:**  
  Allows users to download the generated ID card as a PNG image using `html-to-image`.

- **Template Switching:**  
  Users can switch between two design templates that use different styling classes for the ID card.

- **Persistent Data (Bonus Feature):**  
  Saved cards are stored in `localStorage` so that users can view and download previously generated cards.

## Technologies & Libraries

- **React (v18+)** – for building the user interface.
- **qrcode.react** – for generating QR codes. (Note: Uses the `QRCodeCanvas` component.)
- **html-to-image** – for exporting DOM elements as PNG images.
- **Plain CSS** – for styling the application.

## Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/kprince612/college_id
   cd student-id-card-generator
