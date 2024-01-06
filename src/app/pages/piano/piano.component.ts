import { Component } from '@angular/core';

const englishKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const englishFlats = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'] as const;

const solfageKeys = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'] as const;
const solfageFlats = ['Re♭', 'Mi♭', 'Sol♭', 'La♭', 'Si♭'] as const;

type NormalEnglishKey = (typeof englishKeys)[number];
type FlatEnglishKey = (typeof englishFlats)[number];
type EnglishKey = NormalEnglishKey | FlatEnglishKey;

type NormalSolfageKey = (typeof solfageKeys)[number];
type FlatSoflageKey = (typeof solfageFlats)[number];
type SolfageKey = NormalSolfageKey | FlatSoflageKey;

type Key = EnglishKey | SolfageKey;

const engToSolfage = new Map<EnglishKey, SolfageKey>();
englishKeys.forEach((eng, index) => engToSolfage.set(eng, solfageKeys[index]));
englishFlats.forEach((eng, index) =>
  engToSolfage.set(eng, solfageFlats[index])
);

export enum NoteSystem {
  ENGLISH = 'English',
  SOLFAGE = 'Solfage',
}

/**A function that accepts a frequency and an Oscillator type and plays a sound accordingly */
export const playNoteFromFrequency = (frequency: number, type: OscillatorType): AudioParam => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.connect(gainNode);
  oscillator.frequency.value = frequency;
  gainNode.connect(context.destination);
  oscillator.start(0);

  return gainNode.gain;
};

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.less'],
})
export class PianoComponent {
  useSharps: boolean = true;
  selectedNoteSystem: NoteSystem = NoteSystem.ENGLISH;
  keys: Key[] = this.getKeysList(this.useSharps);
  /**  frequencies - indexed from C4 to C5, the difference between arr[i] and arr[i+1] always being a semi-tone.
  The middle octave starts a c4*/
  frequencies: number[] = [261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9, 523.3];
  possibleNoteSystems: NoteSystem[] = Object.values(NoteSystem);
  playingSounds = new Map<number, AudioParam>();

  private getKeysList(useSharps: boolean): EnglishKey[] {
    const fullOctave = useSharps
      ? [...englishKeys]
      : englishKeys.map((key) => (key.length > 1 ? this.getFlat(key) : key));

    return [...fullOctave, 'C'];
  }

  private getFlat(sharpKey: NormalEnglishKey): FlatEnglishKey {
    const sharpIndex = englishKeys.indexOf(sharpKey);
    const nextNatural = englishKeys[sharpIndex + 1];

    return englishFlats.find((flat) => flat[0] === nextNatural[0])!;
  }

  playNote(noteIndex: number): void {
    // use english keys and indecies so we don't have to find a note based on it's flat/sharp form
    const TYPE: OscillatorType = 'sine';

    // prevent a note from continuing to play endlessly 
    this.playingSounds.get(noteIndex)?.exponentialRampToValueAtTime(0.00001, 1);
    this.playingSounds.set(
      noteIndex,
      playNoteFromFrequency(this.frequencies[noteIndex], TYPE)
    );
  }

  stopNote(noteIndex: number): void {
      this.playingSounds.get(noteIndex)?.exponentialRampToValueAtTime(0.00001, 1);
      this.playingSounds.delete(noteIndex);
  }

  getSystemKeys(system: NoteSystem): Key[] {
    const englishKeyList = this.getKeysList(this.useSharps);
    switch (system) {
      case NoteSystem.SOLFAGE:
        return englishKeyList.map((key) => engToSolfage.get(key)!);
      default:
        return englishKeyList;
    }
  }

  swapKeys(): void {
    this.keys = [...this.getSystemKeys(this.selectedNoteSystem)];
  }
}