'use strict';
// Nine games. Each has ONE learning goal and builds a fresh random question set per play.
BG.GAMES = {};
const opt = (label, correct = false) => ({ label, correct });
const say = (...k) => BG.h('div', null, ...k);

// ---------------------------------------------------------------- 1. Data Sorter
BG.GAMES.sorter = {
  title: 'Data Sorter', lesson: '1-1',
  goal: 'Classify a clinical variable as nominal, ordinal, discrete or continuous.',
  pool: [
    ['Blood group (A, B, AB, O)', 'Nominal', 'Categories with no natural order.'],
    ['Pain score from 0 to 10', 'Ordinal', 'Ordered categories; the gap between 2 and 3 is not guaranteed to equal the gap between 8 and 9. The book uses this exact example.'],
    ['Number of hospital admissions last year', 'Discrete', 'A count: 0, 1, 2…, never 1.5.'],
    ['Body weight in kg', 'Continuous', 'A measurement that can take any value in a range.'],
    ['Cancer stage (I, II, III, IV)', 'Ordinal', 'Ordered categories: stage IV is worse than stage II, but not "twice" as bad.'],
    ['Number of patients on a ward', 'Discrete', 'A count of whole people.'],
    ['Systolic blood pressure (mmHg)', 'Continuous', 'Measured on a continuous scale.'],
    ['Glasgow Coma Scale (3–15)', 'Ordinal', 'An ordered clinical score; points are not equal steps of consciousness.'],
    ['Number of seizures this month', 'Discrete', 'A count.'],
    ['Eye colour', 'Nominal', 'Unordered categories.'],
    ['Height in cm', 'Continuous', 'A measurement.'],
    ['Patient satisfaction: poor / fair / good / excellent', 'Ordinal', 'Ordered categories.'],
    ['Number of missing teeth', 'Discrete', 'A count.'],
    ['Mode of delivery (vaginal / caesarean)', 'Nominal', 'Two unordered categories.'],
    ['Body temperature (°C)', 'Continuous', 'A measurement.'],
    ['Country of birth', 'Nominal', 'Unordered categories.'],
    ['Age in years (exact)', 'Continuous', 'Age flows continuously; the book lists it as continuous.'],
    ['NYHA heart-failure class (I–IV)', 'Ordinal', 'Ordered severity classes.'],
    ['Number of cigarettes smoked per day', 'Discrete', 'A count of whole cigarettes.'],
    ['Serum sodium (mmol/L)', 'Continuous', 'A laboratory measurement.']
  ],
  build() {
    return BG.sample(this.pool, 10).map(([v, ans, why]) => ({
      mount: (box, done) => BG.mcq(box, {
        visual: BG.h('div', { class: 'var-card' }, BG.h('span', { class: 'eyebrow' }, 'Variable'), BG.h('div', { class: 'var-name' }, v)),
        prompt: 'What type of data is this?', columns: 2, shuffle: false,
        options: ['Nominal', 'Ordinal', 'Discrete', 'Continuous'].map((t) => opt(t, t === ans)),
        explain: say(BG.b(ans + '. '), why)
      }, done)
    }));
  }
};

// ---------------------------------------------------------------- 2. Centre & Spread Lab
BG.GAMES.spread = {
  title: 'Center & Spread Lab', lesson: '1-1',
  goal: 'Predict how changing one value moves the mean, median, SD and range.',
  contexts: [
    { label: 'Heart rate', unit: 'bpm', min: 40, max: 140, c: 74, sd: 7, step: 20 },
    { label: 'Length of stay', unit: 'days', min: 0, max: 30, c: 6, sd: 2, step: 5 },
    { label: 'Age', unit: 'years', min: 20, max: 100, c: 48, sd: 7, step: 10 }
  ],
  statInfo: {
    mean: ['mean', (s) => s.mean], median: ['median', (s) => s.median], sd: ['standard deviation', (s) => s.sd], range: ['range', (s) => s.range]
  },
  makeQ(stat) {
    const statInfo = this.statInfo;
    for (let tries = 0; tries < 400; tries++) {
      const ctx = BG.pick(this.contexts);
      const vals = Array.from({ length: 9 }, () => Math.max(ctx.min, Math.min(ctx.max, Math.round(ctx.c + BG.normal() * ctx.sd))));
      const i = BG.randInt(0, 8);
      const span = ctx.max - ctx.min;
      const nv = BG.randInt(ctx.min, ctx.max);
      if (Math.abs(nv - vals[i]) < span * 0.2) continue;
      const after = vals.slice(); after[i] = nv;
      const f = statInfo[stat][1];
      const a = f(BG.stats(vals)), b = f(BG.stats(after));
      const diff = b - a;
      if (Math.abs(diff) > 1e-9 && Math.abs(diff) < 0.5) continue; // too close to call
      const answer = Math.abs(diff) < 1e-9 ? 'Stays the same' : diff > 0 ? 'Increases' : 'Decreases';
      return { ctx, vals, i, nv, a, b, answer };
    }
    return null;
  },
  build() {
    const stats = BG.shuffle(['mean', 'median', 'sd', 'range', 'median', 'sd']);
    const qs = stats.map((stat) => {
      const q = this.makeQ(stat);
      const [name] = this.statInfo[stat];
      const why = {
        mean: 'The mean uses every value, so changing any one value moves it.',
        median: q.answer === 'Stays the same'
          ? 'The median only depends on which value sits in the middle after sorting. This change did not alter the middle value.'
          : 'The value crossed (or was) the middle of the sorted list, so the middle value changed.',
        sd: 'SD is the typical distance from the mean. Moving a value away from the centre increases it; moving it toward the centre decreases it.',
        range: q.answer === 'Stays the same' ? 'The range only depends on the minimum and the maximum, and neither changed.' : 'The range only depends on the minimum and maximum, and this change moved one of them.'
      }[stat];
      return {
        mount: (box, done) => {
          const lab = BG.statsLab({ values: q.vals, min: q.ctx.min, max: q.ctx.max, step: q.ctx.step, label: q.ctx.label, unit: q.ctx.unit, draggable: false });
          lab.highlight(q.i);
          BG.mcq(box, {
            visual: BG.h('div', { class: 'demo' }, lab.el),
            prompt: BG.h('span', null, `One patient (ringed) changes from `, BG.b(`${q.vals[q.i]} to ${q.nv} ${q.ctx.unit}`), `. What happens to the `, BG.b(name), '?'),
            options: ['Increases', 'Decreases', 'Stays the same'].map((t) => opt(t, t === q.answer)), shuffle: false, columns: 3,
            afterAnswer: () => setTimeout(() => lab.move(q.i, q.nv), 150),
            explain: say(BG.b(`${name[0].toUpperCase() + name.slice(1)}: ${BG.fmt(q.a)} → ${BG.fmt(q.b)}. `), why, ' Watch the dot move.')
          }, done);
        }
      };
    });
    const skewLab = () => BG.statsLab({ values: BG.LAB_PRESETS.right, label: 'ICU length of stay', unit: 'hours', draggable: false }).el;
    qs.push({
      mount: (box, done) => BG.mcq(box, {
        prompt: 'Hospital length of stay is right-skewed: most patients leave quickly, a few stay a very long time. What is the usual order of the three averages?',
        options: [opt('Mode < Median < Mean', true), opt('Mean < Median < Mode'), opt('Mean = Median = Mode'), opt('Median < Mode < Mean')],
        explain: say('The long right tail pulls the mean upward. The median moves less, and the mode sits at the peak. ', BG.b('Mode < median < mean.'), ' The book’s "mean, median, mode in increasing order" is only true for left-skewed data.', BG.h('div', { class: 'demo' }, skewLab()))
      }, done)
    });
    qs.push({
      mount: (box, done) => BG.mcq(box, {
        prompt: 'You want to report a "typical" length of stay for that skewed data. Which summary is least affected by the few very long stays?',
        options: [opt('Median', true), opt('Mean'), opt('Range'), opt('Standard deviation')],
        explain: say(BG.b('Median. '), 'It depends only on order, so a few extreme values barely change it. Range and SD describe spread, not a typical value.')
      }, done)
    });
    return qs;
  }
};

// ---------------------------------------------------------------- 3. Disease Bathtub
BG.GAMES.bathtub = {
  title: 'Disease Bathtub', lesson: '1-2',
  goal: 'Tell incidence (new cases) apart from prevalence (all current cases).',
  scenarios: [
    { text: 'A new drug keeps patients alive much longer but does not cure the disease.', change: { d: 0.01 },
      ask: { prevalence: ['Increases', 'Fewer people leave the tub through the death drain, so the water level rises.'], incidence: ['Stays the same', 'The drug does not stop anyone getting the disease, so the tap is unchanged.'] } },
    { text: 'A vaccine prevents most new infections.', change: { I: 3 },
      ask: { incidence: ['Decreases', 'Fewer new cases means a weaker tap.'], prevalence: ['Decreases', 'With less inflow, the water level falls over time.'] } },
    { text: 'A new treatment cures the disease within a few weeks.', change: { r: 0.5 },
      ask: { prevalence: ['Decreases', 'People leave the tub quickly through the recovery drain, so the level drops.'], incidence: ['Stays the same', 'A cure does not prevent new cases.'] } },
    { text: 'The disease becomes much more rapidly fatal.', change: { d: 0.4 },
      ask: { prevalence: ['Decreases', 'Shorter duration means a lower level. A falling prevalence is not always good news.'], incidence: ['Stays the same', 'How fast people die does not change how many new cases appear.'] } },
    { text: 'Exposure to the main risk factor doubles in the population.', change: { I: 20 },
      ask: { incidence: ['Increases', 'More people develop the disease, so the tap opens wider.'], prevalence: ['Increases', 'More inflow raises the level.'] } },
    { text: 'Hundreds of people who already have the disease move into the town.', jump: 140,
      ask: { prevalence: ['Increases', 'Existing cases are poured straight into the tub, so prevalence jumps.'], incidence: ['Stays the same', 'They are not new cases arising in the town, so incidence does not change.'] } }
  ],
  calc: [
    () => ({ prompt: 'A town of 10,000 people has 200 people with diabetes on 1 January. What is the prevalence on that day?',
      options: [opt('2%', true), opt('0.5%'), opt('20%'), opt('0.2%')], explain: say('Prevalence = existing cases ÷ population = 200 ÷ 10,000 = ', BG.b('2%'), '.') }),
    () => ({ prompt: 'Same town: 50 new cases of diabetes are diagnosed during the year. What is the yearly incidence (risk)?',
      options: [opt('About 0.5%', true), opt('2.5%'), opt('2%'), opt('About 25%')],
      explain: say('Incidence = new cases ÷ people at risk = 50 ÷ (10,000 − 200) ≈ ', BG.b('0.51%'), '. The 200 who already had diabetes cannot become new cases, so they leave the denominator.') }),
    () => ({ prompt: 'A survey on one day finds that 300 of 10,000 adults currently have asthma. What does this measure?',
      options: [opt('Prevalence', true), opt('Incidence'), opt('Mortality rate'), opt('Relative risk')],
      explain: say(BG.b('Prevalence'), ': all existing cases at one point in time. It is a snapshot, so it does not tell you which cases are new.') }),
    () => ({ prompt: 'A chronic disease has an incidence of 20 per 10,000 people per year and lasts 5 years on average. Roughly what is its prevalence?',
      options: [opt('100 per 10,000', true), opt('4 per 10,000'), opt('25 per 10,000'), opt('400 per 10,000')],
      explain: say('Prevalence ≈ incidence × duration = 20 × 5 = ', BG.b('100 per 10,000'), ' (1%).') })
  ],
  build() {
    const qs = BG.shuffle(this.scenarios).map((s) => {
      const which = BG.pick(Object.keys(s.ask));
      const [ans, why] = s.ask[which];
      return {
        mount: (box, done) => {
          const tub = BG.bathtub({ I: 10, r: 0.1, d: 0.05, controls: false });
          BG.mcq(box, {
            visual: BG.h('div', { class: 'demo' }, tub.el),
            prompt: BG.h('span', null, s.text, ' What happens to ', BG.b(which), '?'),
            options: ['Increases', 'Decreases', 'Stays the same'].map((t) => opt(t, t === ans)), shuffle: false, columns: 3,
            afterAnswer: () => { if (s.jump) tub.setPrev(67 + s.jump); else tub.set(s.change); },
            explain: say(BG.b(ans + '. '), why, ' Watch the tub.')
          }, done);
        }
      };
    });
    BG.sample(this.calc, 3).forEach((f) => qs.push({ mount: (box, done) => BG.mcq(box, f(), done) }));
    return qs;
  }
};

// ---------------------------------------------------------------- 4. PICO Builder
BG.GAMES.pico = {
  title: 'PICO Builder', lesson: '1-3',
  goal: 'Turn a clinical scenario into a structured PICO question.',
  pool: [
    { story: 'Dr. Lina sees many adults with type 2 diabetes who take metformin. She wonders whether adding an SGLT2 inhibitor would lower their risk of being admitted for heart failure compared with staying on metformin alone.',
      P: 'Adults with type 2 diabetes', I: 'Adding an SGLT2 inhibitor', C: 'Metformin alone', O: 'Heart-failure admissions', X: 'Price of the tablets' },
    { story: 'A GP wonders if young children with an acute ear infection recover from ear pain faster with immediate antibiotics than with a "wait and see" approach.',
      P: 'Young children with acute ear infection', I: 'Immediate antibiotics', C: 'Wait and see', O: 'Time until ear pain resolves', X: 'Name of the clinic' },
    { story: 'A smoking-cessation nurse asks whether varenicline helps more adult smokers stay smoke-free at 6 months than nicotine patches do.',
      P: 'Adult smokers who want to quit', I: 'Varenicline', C: 'Nicotine patches', O: 'Smoke-free at 6 months', X: 'Number of nurses in the clinic' },
    { story: 'An orthopaedic team asks whether getting patients out of bed on the day of knee-replacement surgery shortens hospital stay compared with starting on day 2.',
      P: 'Patients after knee replacement', I: 'Mobilization on the day of surgery', C: 'Mobilization from day 2', O: 'Length of hospital stay', X: 'Brand of knee implant' },
    { story: 'A doctor asks whether postmenopausal women with osteoporosis who take a bisphosphonate have fewer hip fractures than those given a placebo.',
      P: 'Postmenopausal women with osteoporosis', I: 'Bisphosphonate', C: 'Placebo', O: 'Hip fractures', X: 'Hospital car-park size' },
    { story: 'A physiotherapist wonders whether adults with acute low-back pain return to work sooner with a home exercise programme than with bed rest.',
      P: 'Adults with acute low-back pain', I: 'Home exercise programme', C: 'Bed rest', O: 'Time to return to work', X: "Physiotherapist's years of experience" }
  ],
  build() {
    return BG.sample(this.pool, 5).map((sc) => ({
      mount: (box, done) => {
        const keys = ['P', 'I', 'C', 'O'];
        const names = { P: 'Patient / Population', I: 'Intervention', C: 'Comparison', O: 'Outcome' };
        const placed = { P: null, I: null, C: null, O: null };
        let selected = null;
        const chips = BG.shuffle([...keys, 'X']).map((k) => {
          const c = BG.h('button', { class: 'chip', 'data-k': k, onclick: () => pickChip(c) }, sc[k]);
          return c;
        });
        const tray = BG.h('div', { class: 'tray' }, chips);
        const slots = keys.map((k) => {
          const s = BG.h('button', { class: 'slot', 'data-k': k, onclick: () => drop(k) },
            BG.h('span', { class: 'pico-letter' }, k), BG.h('span', { class: 'slot-name' }, names[k]), BG.h('span', { class: 'slot-val' }, 'tap a phrase, then tap here'));
          return s;
        });
        const check = BG.h('button', { class: 'btn primary', disabled: true, onclick: grade }, 'Check my PICO');
        function pickChip(c) {
          if (c.disabled) return;
          const owner = keys.find((k) => placed[k] === c);
          if (owner) { placed[owner] = null; c.classList.remove('used'); render(); return; } // tap a placed chip to return it
          selected = selected === c ? null : c;
          chips.forEach((x) => x.classList.toggle('sel', x === selected));
        }
        function drop(k) {
          if (!selected) {
            if (placed[k]) { placed[k].classList.remove('used'); placed[k] = null; render(); }
            return;
          }
          if (placed[k]) placed[k].classList.remove('used');
          keys.forEach((j) => { if (placed[j] === selected) placed[j] = null; });
          placed[k] = selected; selected.classList.add('used'); selected.classList.remove('sel'); selected = null;
          render();
        }
        function render() {
          slots.forEach((s, n) => {
            const k = keys[n];
            s.querySelector('.slot-val').textContent = placed[k] ? placed[k].textContent : 'tap a phrase, then tap here';
            s.classList.toggle('filled', !!placed[k]);
          });
          check.disabled = keys.some((k) => !placed[k]);
        }
        function grade() {
          let right = 0;
          slots.forEach((s, n) => {
            const k = keys[n]; const ok = placed[k].dataset.k === k;
            if (ok) right++;
            s.classList.add(ok ? 'right' : 'wrong'); s.disabled = true;
          });
          chips.forEach((c) => { c.disabled = true; });
          check.disabled = true;
          done(right / 4, say(
            BG.h('div', { class: 'pico-demo' }, keys.map((k) => BG.h('div', { class: 'pico-row' }, BG.h('span', { class: 'pico-letter' }, k), BG.h('span', { class: 'pico-name' }, names[k]), BG.h('span', { class: 'pico-ex' }, sc[k])))),
            BG.h('p', null, `"${sc.X}" is not part of the question. It does not describe the patients, the treatments being compared, or what is measured.`)));
        }
        box.append(BG.h('div', { class: 'story' }, sc.story), BG.h('p', { class: 'qprompt' }, 'Build the PICO question. One phrase does not belong.'),
          tray, BG.h('div', { class: 'slots' }, slots), BG.h('div', { class: 'row' }, check));
      }
    }));
  }
};

// ---------------------------------------------------------------- 5. Study Design Detective
BG.GAMES.designs = {
  title: 'Study Design Detective', lesson: '2-1',
  goal: 'Identify the study design from a short description.',
  pool: [
    ['Researchers survey 2,000 adults once, asking whether they smoke now and whether they have asthma now.', 'cross', 'Exposure and outcome are measured at the same moment.'],
    ['A national survey measures the BMI and blood pressure of a sample of adults during one month.', 'cross', 'One snapshot of a population.'],
    ['In 2020, 5,000 nurses record their diet. The researchers then follow them for 10 years to see who develops heart disease.', 'procohort', 'Grouped by exposure now, then followed into the future.'],
    ['First-year medical students report their daily phone use and are followed for 5 years to see who becomes short-sighted.', 'procohort', 'Exposure measured first, outcome observed later.'],
    ['Using 1990 factory records, researchers identify workers who were or were not exposed to asbestos, then check medical records up to today for lung cancer.', 'retrocohort', 'Starts from past exposure in old records and traces outcomes forward to today.'],
    ['From 1970s army records, soldiers exposed and not exposed to a herbicide are identified, and their cancer diagnoses since then are traced.', 'retrocohort', 'Exposure groups taken from historical records, outcomes traced forward.'],
    ['200 patients with mesothelioma and 400 people without it are asked about past asbestos exposure.', 'casecontrol', 'Chosen by disease status, then asked about past exposure.'],
    ['Mothers of babies born with a heart defect and mothers of healthy babies are asked about medicines taken during pregnancy.', 'casecontrol', 'Starts from the outcome (defect or not) and looks back.'],
    ['600 people with hypertension are allocated by a computer-generated random list to a new drug or the standard drug. Blood pressure is measured at 12 weeks.', 'rct', 'Investigator assigns the treatment, at random, with a control group.'],
    ['Twenty schools are randomly assigned to a healthy-lunch programme or usual meals, and children’s BMI is compared after a year.', 'rct', 'Random assignment of the intervention (here by school, a cluster RCT).'],
    ['30 migraine patients take drug A for 8 weeks, then nothing for 2 weeks, then drug B for 8 weeks. The order is decided at random for each patient.', 'crossover', 'Each patient gets both treatments in turn, with a washout.'],
    ['People with chronic insomnia receive a sleep pill and a placebo in random order, separated by a washout week.', 'crossover', 'Everyone receives both and acts as their own control.'],
    ['One hospital introduces a hand-hygiene programme. Its infection rate is compared with a neighbouring hospital that did not. No randomization is used.', 'quasi', 'The investigator applied an intervention but chose who got it.'],
    ['A ward measures its fall rate for 6 months, introduces bed alarms, then measures the fall rate for 6 more months.', 'quasi', 'Before-and-after intervention with no randomized control group.']
  ],
  build() {
    const keys = Object.keys(BG.DESIGNS);
    return BG.sample(this.pool, 10).map(([text, ans, why]) => ({
      mount: (box, done) => BG.mcq(box, {
        visual: BG.h('div', { class: 'story' }, text),
        prompt: 'Which study design is this?', shuffle: false, columns: 2,
        options: keys.map((k) => opt(BG.DESIGNS[k].name, k === ans)),
        explain: say(BG.b(BG.DESIGNS[ans].name + '. '), why, BG.timeline(ans))
      }, done)
    }));
  }
};

// ---------------------------------------------------------------- 6. Randomizer
BG.GAMES.randomizer = {
  title: 'Randomizer', lesson: '2-2',
  goal: 'Explain why random allocation creates comparable groups.',
  build() {
    const withSim = (n, mode, reveal, q) => ({
      mount: (box, done) => {
        const r = BG.randomizer({ n, controls: false });
        if (reveal) r.reveal(true);
        setTimeout(() => r.allocate(mode), BG.reducedMotion() ? 0 : 350);
        BG.mcq(box, Object.assign({ visual: BG.h('div', { class: 'demo' }, r.el) }, q), done);
      }
    });
    const plain = (q) => ({ mount: (box, done) => BG.mcq(box, q, done) });
    return [
      withSim(40, 'doctor', false, {
        prompt: 'The doctor chose who got the new drug. In this simulation the drug has no effect at all. Look at the "High-risk" row. What is the main problem?',
        options: [opt('The groups were not comparable before treatment: healthier patients got the new drug', true), opt('The new drug must actually work'), opt('The placebo effect'), opt('There were too many patients')],
        explain: say('Doctor’s choice put mostly low-risk patients in the new-drug group, so that group recovers more often even with a useless drug. This is ', BG.b('selection bias'), ' in allocation.')
      }),
      withSim(200, 'random', true, {
        prompt: 'Nobody measured the hidden gene (marked dots). After coin-flip allocation of 200 patients, how is the gene spread between groups?',
        options: [opt('About evenly: randomization balances unmeasured factors too', true), opt('All in one group'), opt('It cannot be balanced because nobody measured it'), opt('It is only balanced if the doctor chooses')],
        explain: say('Chance does not know or care about the gene, so each group gets roughly its fair share. This is why randomization controls ', BG.b('known and unknown'), ' confounders.')
      }),
      withSim(12, 'random', false, {
        prompt: 'This is a coin-flip allocation of only 12 patients. Compared with 200 patients, is a small trial more or less likely to end up with clearly unbalanced groups by chance?',
        options: [opt('More likely: with few patients, chance imbalances are common', true), opt('Less likely'), opt('Equally likely'), opt('Impossible: randomization always balances perfectly')],
        explain: say('Randomization balances groups ', BG.b('on average'), '. With small numbers, chance can still give lopsided groups. Larger trials balance better.')
      }),
      plain({
        prompt: 'Which allocation method is truly random?',
        options: [opt('A computer-generated random sequence', true), opt('Alternating by day of the week'), opt('The doctor decides for each patient'), opt('Patients choose their group')],
        explain: say('Only a random sequence is unpredictable. Day-of-week or doctor choice can be anticipated or influenced, which reintroduces selection bias.')
      }),
      plain({
        prompt: 'What is the main purpose of randomization?',
        options: [opt('To create comparable groups and minimize selection bias', true), opt('To make the study cheaper'), opt('To stop participants knowing their group'), opt('To increase the sample size')],
        explain: say('Randomization makes the groups ', BG.b('comparable'), '. Hiding the group from participants is ', BG.b('blinding'), ', a different tool.')
      }),
      plain({
        prompt: 'After randomizing 40 patients, the new-drug group is on average 2 years older. Has randomization failed?',
        options: [opt('No: small chance differences are expected; groups are comparable on average, not identical', true), opt('Yes: the trial must be stopped'), opt('Yes: doctor’s choice would have been better'), opt('Yes: the results are now invalid')],
        explain: say('Small baseline differences happen by chance and can be adjusted for in the analysis if they matter. Randomization guarantees fairness of the process, not identical groups.')
      })
    ];
  }
};

// ---------------------------------------------------------------- 7. Who Knows? (blinding)
BG.GAMES.blinding = {
  title: 'Who Knows?', lesson: '2-2',
  goal: 'Name the blinding level from who does not know the treatment assignment.',
  trials: [
    { name: 'a new painkiller versus placebo', p: ['Patients are told which pill they are getting.', 'Patients receive identical-looking capsules.'],
      r: ['The prescribing doctors know which capsule is which.', 'The prescribing doctors do not know which capsule is which.'],
      a: ['The nurse who scores pain at 24 hours knows each patient’s group.', 'The nurse who scores pain at 24 hours does not know the groups.'] },
    { name: 'a new antidepressant versus sertraline', p: ['Participants know which drug they take.', 'Both drugs are packed in identical bottles, so participants cannot tell them apart.'],
      r: ['The psychiatrists treating them know the assignment.', 'The treating psychiatrists are also kept unaware of the assignment.'],
      a: ['The psychologist rating depression scores knows the groups.', 'The psychologist rating depression scores is unaware of the groups.'] },
    { name: 'physiotherapy versus a sham (fake) device', p: ['Patients know whether the device is real.', 'Patients cannot tell the sham device from the real one.'],
      r: ['The therapists applying it know which device is real.', 'The device is pre-coded, so the therapists cannot tell which is real.'],
      a: ['The assessor measuring knee movement knows the groups.', 'The assessor measuring knee movement does not know the groups.'] }
  ],
  build() {
    const levels = Object.keys(BG.BLIND_LEVELS);
    const order = BG.shuffle([...levels, ...levels]).slice(0, 6);
    const qs = order.map((lvl) => {
      const t = BG.pick(this.trials);
      const bl = BG.BLIND_LEVELS[lvl];
      const lines = [t.p, t.r, t.a].map((pair, i) => pair[bl.includes(i) ? 1 : 0]);
      return {
        mount: (box, done) => {
          const cards = BG.blindCards([]);
          BG.mcq(box, {
            visual: BG.h('div', { class: 'story' }, BG.h('p', null, `A trial compares ${t.name}.`), BG.h('ul', { class: 'tight' }, lines.map((l) => BG.h('li', null, l)))),
            prompt: 'What is this design called?', shuffle: false, columns: 2,
            options: levels.map((k) => opt(BG.BLIND_NAMES[k], k === lvl)),
            afterAnswer: () => { box.append(cards); setTimeout(() => cards.set(bl), 200); },
            explain: say(BG.b(BG.BLIND_NAMES[lvl] + '. '),
              bl.length ? `Unaware: ${bl.map((i) => BG.ROLES[i].toLowerCase()).join(', ')}.` : 'Everyone knows the assignment.',
              ' Book definitions: single = participants; double = participants + researchers; triple = participants + researchers + outcome assessors.')
          }, done);
        }
      };
    });
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'In a double-blind trial, who does NOT know the treatment assignment?',
      options: [opt('Participants and researchers', true), opt('Only the participants'), opt('Participants, researchers and outcome assessors'), opt('Nobody is unaware')],
      explain: say(BG.b('Participants and researchers'), ' (book p. 23).')
    }, done) });
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'Why do placebo-controlled trials use a placebo that looks exactly like the real pill?',
      options: [opt('So participants cannot tell which group they are in, keeping them blind', true), opt('To make the trial cheaper'), opt('To randomize the patients'), opt('To increase the sample size')],
      explain: say('An identical placebo makes blinding possible. Then any improvement from ', BG.b('expectation (the placebo effect)'), ' happens equally in both groups and cancels out.')
    }, done) });
    return qs;
  }
};

// ---------------------------------------------------------------- 8. Sampling Machine
BG.GAMES.sampling = {
  title: 'Sampling Machine', lesson: '2-3',
  goal: 'Recognize the five sampling methods and which one is prone to bias.',
  explain: {
    random: 'Picks are scattered with no pattern, and the age mix varies from draw to draw.',
    systematic: 'The same position is picked in every village: every 5th person on the list after a random start.',
    cluster: 'Two whole villages were chosen, and everyone in them was taken.',
    stratified: 'The sample’s age mix exactly matches the population (10 young, 6 middle-aged, 4 older), because each age group was sampled separately.'
  },
  scenarios: [
    ['A researcher stands at the clinic entrance and enrols the first 50 people who agree.', 'convenience'],
    ['A computer draws 300 ID numbers from the national health register.', 'random'],
    ['The country’s schools are listed, 8 are chosen at random, and every pupil in those schools is surveyed.', 'cluster'],
    ['Starting at a random number between 1 and 10, every 10th patient on the admissions list is selected.', 'systematic'],
    ['Patients are split by age group, then a random sample is drawn from each age group in proportion to its size.', 'stratified'],
    ['Medical students hand out questionnaires to their friends and classmates.', 'convenience'],
    ['Villages in a large rural district are chosen at random, and all households in the chosen villages are visited.', 'cluster'],
    ['To make sure rare blood groups are represented, donors are divided by blood group and randomly sampled within each.', 'stratified']
  ],
  build() {
    const anim = BG.shuffle(['random', 'systematic', 'cluster', 'stratified', BG.pick(['random', 'systematic', 'cluster', 'stratified'])]);
    const names = BG.SAMPLING_NAMES;
    const qs = anim.map((m) => ({
      mount: (box, done) => {
        const mach = BG.samplingMachine({ controls: false });
        let sel;
        for (let t = 0; t < 50; t++) {
          sel = mach.run(m, false);
          if (m !== 'random') break;
          const counts = [0, 1, 2].map((k) => sel.filter((p) => p.s === k).length).join();
          const villages = new Set(sel.map((p) => p.village)).size;
          if (counts !== '10,6,4' && villages > 3) break; // keep simple random clearly different
        }
        mach.el.querySelectorAll('.pp').forEach((g) => g.classList.remove('picked', 'dim'));
        setTimeout(() => {
          const ids = new Set(sel.map((p) => p.id));
          mach.people.forEach((p) => p.el.classList.add('dim'));
          sel.slice().sort((a, b) => a.id - b.id).forEach((p, k) => setTimeout(() => { p.el.classList.remove('dim'); p.el.classList.add('picked'); }, BG.reducedMotion() ? 0 : 70 * k));
          return ids;
        }, 200);
        BG.mcq(box, {
          visual: BG.h('div', { class: 'demo' }, mach.el),
          prompt: 'Which method produced this sample of 20? Look at where the picked people are and at the age mix.',
          options: ['random', 'stratified', 'cluster', 'systematic'].map((k) => opt(names[k], k === m)), shuffle: false, columns: 2,
          explain: say(BG.b(names[m] + '. '), this.explain[m])
        }, done);
      }
    }));
    BG.sample(this.scenarios, 4).forEach(([text, m]) => qs.push({
      mount: (box, done) => BG.mcq(box, {
        visual: BG.h('div', { class: 'story' }, text), prompt: 'Which sampling method is this?', shuffle: false, columns: 2,
        options: Object.keys(names).map((k) => opt(names[k], k === m)),
        explain: say(BG.b(names[m] + '.'))
      }, done)
    }));
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'Which sampling method is most likely to give a biased, non-representative sample?',
      options: [opt('Convenience', true), opt('Simple random'), opt('Stratified'), opt('Systematic')],
      explain: say(BG.b('Convenience. '), 'People who are easy to reach (clinic visitors, friends, volunteers) differ systematically from everyone else. That is selection bias.')
    }, done) });
    return qs;
  }
};

// ---------------------------------------------------------------- 9. Bias Hunter
BG.BIAS_NAMES = { hv: 'Healthy-volunteer bias', berkson: "Berkson's bias", recall: 'Recall bias', pub: 'Publication (reporting) bias', conf: 'Confounding', sel: 'Selection bias (non-representative sample)' };
BG.GAMES.bias = {
  title: 'Bias Hunter', lesson: '2-4',
  goal: 'Name the bias or the confounder in a study scenario.',
  pool: {
    hv: [['A gym chain invites its members to volunteer for a heart-health study. The volunteers have far lower cardiac death rates than the national population, and the authors say the results apply to everyone.', 'Volunteers, especially gym members, are healthier than the general population.']],
    berkson: [['To study whether gallstones are linked to diabetes, researchers take both cases and controls from hospital inpatients, many of whom have several illnesses.', 'Hospital patients are not typical of the population: being admitted is linked to having multiple diseases.'],
      ['Controls for a case-control study of lung disease are taken from patients admitted to the same hospital’s cardiology ward.', 'Hospital controls have their own diseases and exposures (e.g. smoking), which distorts the comparison.']],
    recall: [['Mothers of babies born with a heart defect, and mothers of healthy babies, are asked to remember every medicine taken during pregnancy.', 'Mothers of affected babies search their memories harder, so exposures are reported unequally.'],
      ['Patients with stomach cancer and healthy controls are asked what they ate 20 years ago. The patients have spent months wondering what caused their illness.', 'Cases remember (or over-report) past exposures differently from controls.']],
    pub: [['A meta-analysis includes only published trials. Several small trials that found no benefit were never published.', 'The published evidence over-represents positive results, so the pooled effect is too large.'],
      ['A company publishes its 4 trials with positive results and never publishes its 3 trials that showed no effect.', 'Selective publication makes the drug look better than it is.']],
    conf: [['People with grey hair have more heart disease than people without grey hair.', 'Age causes both grey hair and heart disease. Grey hair itself is harmless.'],
      ['People with yellow-stained fingers get lung cancer more often.', 'Smoking causes both the stained fingers and the cancer.'],
      ['Ice-cream sales and drowning deaths rise and fall together.', 'Hot weather increases both ice-cream eating and swimming.']],
    sel: [['An online survey about internet addiction recruits through a social-media advert and reports the results as true for all adults.', 'People who answer a social-media ad are heavier internet users than average.'],
      ['A study of a new heart operation only enrols patients well enough to travel to a distant specialist centre, then says the results apply to all patients.', 'The enrolled patients are fitter than typical patients.']]
  },
  build() {
    const cats = Object.keys(this.pool);
    const chosen = BG.shuffle([...cats, BG.pick(cats)]);
    const used = new Set();
    const qs = chosen.map((cat) => {
      const options = this.pool[cat].filter((s) => !used.has(s[0]));
      const [text, why] = BG.pick(options.length ? options : this.pool[cat]);
      used.add(text);
      const clash = { hv: ['sel'], berkson: ['sel'], sel: ['hv', 'berkson'] }[cat] || [];
      const distract = BG.sample(cats.filter((c) => c !== cat && !clash.includes(c)), 3);
      return { mount: (box, done) => BG.mcq(box, {
        visual: BG.h('div', { class: 'story' }, text), prompt: 'Which problem best explains this?', columns: 1,
        options: [opt(BG.BIAS_NAMES[cat], true), ...distract.map((c) => opt(BG.BIAS_NAMES[c]))],
        explain: say(BG.b(BG.BIAS_NAMES[cat] + '. '), why)
      }, done) };
    });
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'A study finds that coffee drinkers get more lung cancer. Which variable is the most likely confounder?',
      options: [opt('Smoking', true), opt('Lung cancer'), opt('Coffee'), opt('The month the study started')],
      explain: say(BG.b('Smoking. '), 'It is linked to coffee drinking and it causes lung cancer. Within smokers and within non-smokers, coffee shows no link (see the lesson demo).')
    }, done) });
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'Which method, used when designing a study, balances both known and unknown confounders?',
      options: [opt('Randomization', true), opt('Matching'), opt('Stratification'), opt('Multivariable regression')],
      explain: say(BG.b('Randomization. '), 'Matching only handles the factors you match on. Stratification and regression are analysis methods and only work for factors you measured.')
    }, done) });
    qs.push({ mount: (box, done) => BG.mcq(box, {
      prompt: 'Analyzing smokers and non-smokers separately to remove the effect of smoking is called…',
      options: [opt('Stratification', true), opt('Randomization'), opt('Blinding'), opt('Matching')],
      explain: say(BG.b('Stratification'), ': analyzing within each level (stratum) of the confounder.')
    }, done) });
    return qs;
  }
};
