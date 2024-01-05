import { Component } from '@angular/core';

const englishKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const possibleFlatKeys = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'] as const;

type NormalKey = typeof englishKeys[number];
type FlatKey = typeof possibleFlatKeys[number];
type EnglishKey = NormalKey | FlatKey;

/**A function that accepts a frequency and an Oscillator type and plays a sound accordingly */
export const playNoteFromFrequency = (frequency: number, type: OscillatorType): void => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.connect(gainNode);
  oscillator.frequency.value = frequency;
  gainNode.connect(context.destination);
  oscillator.start(0);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
}

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.less']
})
export class PianoComponent {
  useSharps: boolean = true;
  keys: EnglishKey[] = this.getKeysList(this.useSharps);
  /**  frequencies - indexed from C4 to C5, the difference between arr[i] and arr[i+1] always being a semi-tone.
  The middle octave starts a c4*/ 
  frequencies: number[] = [261.6, 277.2, 293.7,	311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9, 523.3];

  private getKeysList(useSharps: boolean): EnglishKey[] {
    const fullOctave = useSharps ?
        [...englishKeys]
        : englishKeys.map(key => key.length > 1 ? this.getFlat(key) : key);

    return [...fullOctave, 'C'];
  }

  private getFlat(sharpKey: NormalKey): FlatKey {
    const sharpIndex = englishKeys.indexOf(sharpKey);
    const nextNatural = englishKeys[sharpIndex + 1];

    return possibleFlatKeys.find(flat => flat[0] === nextNatural[0])!;
  }
  
  renameKeys(): void {
    this.keys = this.getKeysList(this.useSharps);
  }
  
  playNote(noteIndex: number): void {
    // use english keys and indecies so we don't have to find a note based on it's flat/sharp form
    const TYPE: OscillatorType = 'sine';
    
    playNoteFromFrequency(this.frequencies[noteIndex], TYPE);
  }
}