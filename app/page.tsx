"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { NoteColor } from "./notes";
import { AVAILABLE_NOTES, UnopenedNote } from "./available-notes";

interface Note {
  id: string;
  title?: string;
  text: string;
  author?: string;
  imagePath?: string;
  color: NoteColor;
  openedAt: number;
}

const STORAGE_KEY = "i2dey-opened-notes";

export default function I2deyPage() {
  const [clickCount, setClickCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [noteRevealed, setNoteRevealed] = useState(false);
  const [openedNotes, setOpenedNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentRevealedNote, setCurrentRevealedNote] = useState<Note | null>(null);

  // Get the next unopened note
  const getNextUnopenedNote = useCallback((): UnopenedNote | null => {
    const openedIds = new Set(openedNotes.map(n => n.id));
    return AVAILABLE_NOTES.find(note => !openedIds.has(note.id)) || null;
  }, [openedNotes]);

  const hasUnopenedNotes = getNextUnopenedNote() !== null;

  // Load saved notes from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOpenedNotes(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
    }
  }, []);

  // Save notes to localStorage when they change
  const saveNotes = useCallback((notes: Note[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, []);

  // Handle jar click
  const handleJarClick = () => {
    if (noteRevealed || !hasUnopenedNotes) return;

    // Trigger shake animation
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // After 3 clicks, reveal the note
    if (newCount >= 3) {
      const nextNote = getNextUnopenedNote();
      if (!nextNote) return;

      setTimeout(() => {
        setNoteRevealed(true);
        // Save the new note
        const newNote: Note = {
          id: nextNote.id,
          title: nextNote.title,
          text: nextNote.text,
          author: nextNote.author,
          imagePath: nextNote.imagePath,
          color: nextNote.color,
          openedAt: Date.now(),
        };
        setCurrentRevealedNote(newNote);
        const updatedNotes = [...openedNotes, newNote];
        setOpenedNotes(updatedNotes);
        saveNotes(updatedNotes);
        // Open the note in modal
        setSelectedNote(newNote);
        setIsModalOpen(true);
      }, 600);
    }
  };

  // Reset jar for new note
  const handleReset = () => {
    setClickCount(0);
    setNoteRevealed(false);
    setCurrentRevealedNote(null);
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  // Open note in modal
  const openNoteModal = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Main Jar Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 w-full max-w-2xl">

        {/* Jar Container */}
        <div className="relative flex flex-col items-center">
          {/* Jar */}
          <button
            onClick={handleJarClick}
            disabled={noteRevealed || !hasUnopenedNotes}
            className={`relative cursor-pointer transition-transform duration-100 ${isShaking ? "animate-shake" : ""} ${noteRevealed || !hasUnopenedNotes ? "cursor-default opacity-50" : "hover:scale-105 active:scale-95"}`}
          >
            <div className="relative w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]">
              <Image
                src="/note-jar.png"
                alt="Glass mason jar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>
        </div>
      </section>

      {/* Notes History Section */}
      {isClient && openedNotes.length > 0 && (
        <section className="w-full max-w-4xl px-4 pb-16">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...openedNotes].reverse().map((note) => (
              <button
                key={note.id}
                onClick={() => openNoteModal(note)}
                className="group relative aspect-square transition-all duration-300 hover:scale-105 cursor-pointer"
                aria-label={`View note${note.title ? `: ${note.title}` : ""}`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/crumpled-ball.png"
                    alt="Crumpled note"
                    fill
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modal for viewing notes */}
      {isModalOpen && selectedNote && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-fit w-auto max-h-[90vh] overflow-auto transform transition-all duration-300 animate-modalIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="p-6">
              <div className="max-w-2xl">
                {selectedNote.imagePath && (
                  <div className="relative w-auto mb-4 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={`/${selectedNote.imagePath}`}
                      alt="Note image"
                      width={800}
                      height={600}
                      className="object-contain w-auto h-auto max-w-full"
                    />
                  </div>
                )}
                {selectedNote.title && (
                  <h3 className="text-gray-900 text-left font-[var(--font-primary)] text-xl font-bold mb-2">
                    {selectedNote.title}
                  </h3>
                )}
                <p className="text-gray-800 text-left font-[var(--font-secondary)] text-lg">
                  {selectedNote.text}
                </p>
                {selectedNote.author && (
                  <p className="text-gray-600 text-right font-[var(--font-secondary)] text-sm mt-3 italic">
                    — {selectedNote.author}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg) translateY(0); }
          10% { transform: translateX(-8px) rotate(-3deg) translateY(-2px); }
          20% { transform: translateX(8px) rotate(3deg) translateY(2px); }
          30% { transform: translateX(-6px) rotate(-2deg) translateY(-3px); }
          40% { transform: translateX(6px) rotate(2deg) translateY(1px); }
          50% { transform: translateX(-8px) rotate(-3deg) translateY(-2px); }
          60% { transform: translateX(7px) rotate(2.5deg) translateY(2px); }
          70% { transform: translateX(-5px) rotate(-2deg) translateY(-1px); }
          80% { transform: translateX(5px) rotate(2deg) translateY(1px); }
          90% { transform: translateX(-3px) rotate(-1deg) translateY(-1px); }
        }

        @keyframes noteReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .animate-noteReveal {
          animation: noteReveal 0.7s ease-out forwards;
        }

        .animate-modalIn {
          animation: modalIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
