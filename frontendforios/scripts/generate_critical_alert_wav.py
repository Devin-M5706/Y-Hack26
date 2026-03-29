import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44_100
DURATION_SECONDS = 0.6
PRIMARY_FREQ = 1_100.0
SECONDARY_FREQ = 880.0
AMPLITUDE = 0.35


def main() -> None:
    output = Path(__file__).resolve().parents[1] / "assets" / "sounds" / "critical-alert.wav"
    output.parent.mkdir(parents=True, exist_ok=True)

    total_samples = int(SAMPLE_RATE * DURATION_SECONDS)

    with wave.open(str(output), "w") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)

        for index in range(total_samples):
            time_seconds = index / SAMPLE_RATE
            envelope = max(0.0, 1.0 - (time_seconds / DURATION_SECONDS))
            signal = (
                math.sin(2.0 * math.pi * PRIMARY_FREQ * time_seconds)
                + 0.6 * math.sin(2.0 * math.pi * SECONDARY_FREQ * time_seconds)
            ) * 0.5
            sample = int(max(-1.0, min(1.0, signal * AMPLITUDE * envelope)) * 32767)
            wav_file.writeframesraw(struct.pack("<h", sample))

    print(output)


if __name__ == "__main__":
    main()
