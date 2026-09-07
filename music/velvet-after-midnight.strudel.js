// Velvet after midnight. 72 BPM, 4/4, one cycle per bar.
stack(
  // Soft jazz guitar chords: Am9, Dm9, Am9, E7.
  note("<[[a3,c4,e4,b4] ~ ~ [a3,c4,e4,b4]] [[a3,c4,e4,f4] ~ [a3,c4,e4,f4] ~] [[a3,c4,e4,b4] ~ ~ [a3,c4,e4,b4]] [[g#3,b3,d4,e4] ~ [g#3,b3,d4,e4] ~]>")
    .s("gm_electric_guitar_jazz").gain(0.19).lpf(2200).room(0.25).release(0.3),
  // Sparse blues phrases leave room for the chords.
  note("<[~ e5 g5 [eb5 d5]] [c5 ~ a4 ~] [~ c5 d5 [eb5 e5]] [b4 ~ g#4 ~]>")
    .s("gm_electric_guitar_jazz").gain(0.27).lpf(2600)
    .delay(0.13).delaytime(0.28).delayfeedback(0.22).room(0.25),
  note("<[a1 ~ e2 g2] [d2 ~ a1 c2] [a1 ~ c2 e2] [e2 ~ b1 g#1]>")
    .s("gm_acoustic_bass").gain(0.38).lpf(850).release(0.12),
  s("bd ~ [~ bd] ~").gain(0.32).lpf(900),
  s("~ sd ~ sd").gain(0.12).lpf(1800).room(0.12).late(0.008),
  s("hh*8").gain("0.08 0.035").lpf(3300),
  // Filtered noise gives the backbeat a soft brush tail.
  s("~ pink ~ pink").attack(0.025).decay(0.14).sustain(0)
    .release(0.1).hpf(1500).lpf(4200).gain(0.045),
  s("crackle").density(0.15).gain(0.035).lpf(3800)
).swingBy(0.12, 8).cpm(18)
