import { NoteColor } from "./notes";

/**
 * CONTRIBUTING GUIDELINES:
 * ADD NOTES HERE AND THEN ADD IMAGES TO THE /public/i2dey/images FOLDER
 * HEIC IMAGES ARE NOT SUPPORTED BY NEXT/IMAGE, SO USE PNG OR JPG INSTEAD
 * MAKE SURE TO UPDATE THE AVAILABLE_NOTES ARRAY WITH THE NEW NOTE ID - NO DUPLICATE IDS ALLOWED
 * ADD THE COLOR OF THE NOTE TO THE AVAILABLE_NOTES ARRAY - THIS IS USED TO DETERMINE THE COLOR OF THE NOTE
 * COLOR OPTIONS CAN BE FOUND IN THE NOTES.TS FILE
 */

// Predefined notes that can be opened from the jar
export interface UnopenedNote {
  id: string;
  title?: string;
  text: string;
  author?: string;
  imagePath?: string;
  color: NoteColor;
}

export const AVAILABLE_NOTES: UnopenedNote[] = [
  {
    id: "note-1",
    title: "Top Chef",
    text: "You are absolutely goated at cooking! Thank you for feeding us so scrumptiously all of the time. Throwback to last Christmas!",
    author: "ian",
    imagePath: "secret-santa-2024.jpg",
    color: NoteColor.Yellow,
  },
  // Add more notes here as needed
];

