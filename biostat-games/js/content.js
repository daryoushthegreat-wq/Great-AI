'use strict';
// Lesson content for Units 1–2. Page numbers are the PDF page numbers of the book
// "Biostatistics & Epidemiology" (the book has no printed page numbers).
// Explanations are written fresh for this app, not copied from the book.

const P = (...k) => BG.p(...k);
const B = BG.b;
const card = (title, ...body) => BG.h('div', { class: 'concept' }, BG.h('h4', null, title), ...body);
const list = (...items) => BG.h('ul', { class: 'tight' }, items.map((i) => BG.h('li', null, i)));
const mnemonic = (m, t) => BG.h('div', { class: 'mnemonic' }, BG.h('span', { class: 'mn-key' }, m), BG.h('span', null, t));

BG.UNITS = [
  { n: 1, title: 'Introduction to Biostatistics and Epidemiology', pages: '6–17' },
  { n: 2, title: 'Study Design and Sampling Methods', pages: '18–31' }
];

BG.LESSONS = [
  // ------------------------------------------------------------------ 1.1
  {
    id: '1-1', num: '1.1', unit: 1, title: 'Overview of Biostatistics', pages: '6–10',
    terms: {
      'Biostatistics': 'Collecting, summarizing, analyzing and interpreting data to support medical decisions.',
      'Nominal': 'Categories with no order (blood group, sex).',
      'Ordinal': 'Categories with a natural order but unequal gaps (pain scale, cancer stage).',
      'Discrete': 'Counts that take whole numbers (number of admissions).',
      'Continuous': 'Measurements that can take any value in a range (weight, age, blood pressure).',
      'Mean': 'Sum of the values divided by how many there are.',
      'Median': 'The middle value once the data are sorted.',
      'Mode': 'The most frequent value.',
      'Range': 'Maximum minus minimum.',
      'Variance': 'Average squared distance from the mean.',
      'Standard deviation': 'Square root of the variance; spread in the original units.',
      'Probability': 'How likely an event is, from 0 (impossible) to 1 (certain).',
      'Complement rule': "P(not A) = 1 − P(A).",
      'Null hypothesis (H0)': 'No effect or no difference.',
      'Alternative hypothesis (Ha)': 'There is an effect or difference.',
      'p-value': 'If H0 were true, the chance of a result at least as extreme as the one observed.',
      'Type I error (α)': 'Rejecting H0 when it is actually true (false positive).',
      'Type II error (β)': 'Failing to reject H0 when it is actually false (false negative).',
      'Confidence interval': 'A range of plausible values for the true population value, usually at 95% confidence.',
      'Power': 'The chance a study detects a real effect (1 − β). Bigger samples give more power.'
    },
    sections: () => [
      card('What biostatistics is for',
        P('Medicine is full of variation: two patients on the same drug respond differently. Biostatistics is the toolkit for collecting, summarizing, analyzing and interpreting that data so that decisions rest on evidence, not impressions. It measures uncertainty, judges treatment outcomes and finds risk factors.')),
      card('Four types of data',
        BG.h('div', { class: 'tree' },
          BG.h('div', { class: 'tree-col' }, BG.h('div', { class: 'tree-head' }, 'Qualitative (categories)'),
            BG.h('div', { class: 'tree-leaf' }, B('Nominal'), ' no order: blood group, sex'),
            BG.h('div', { class: 'tree-leaf' }, B('Ordinal'), ' ordered: pain scale, cancer stage')),
          BG.h('div', { class: 'tree-col' }, BG.h('div', { class: 'tree-head' }, 'Quantitative (numbers)'),
            BG.h('div', { class: 'tree-leaf' }, B('Discrete'), ' counts: number of patients'),
            BG.h('div', { class: 'tree-leaf' }, B('Continuous'), ' measured: age, weight')))),
      card('Centre and spread',
        P('The ', B('mean'), ' uses every value, so one extreme value drags it. The ', B('median'), ' only cares about order, so it resists outliers. The ', B('mode'), ' is the most common value. The ', B('range'), ' is max − min. The ', B('standard deviation'), ' (SD) is roughly the typical distance from the mean.'),
        BG.demoStatsLab(),
        P('The book (p. 6) defines variance as the average squared difference from the mean (dividing by n). For a sample, statisticians usually divide by n − 1 instead; the idea is the same.')),
      card('Probability in one minute',
        list(BG.h('span', null, B('Addition rule: '), 'P(A or B) = P(A) + P(B) − P(A and B). Subtract the overlap so you do not count it twice.'),
          BG.h('span', null, B('Multiplication rule: '), 'P(A and B) = P(A) × P(B | A), where P(B | A) means "B, given A".'),
          BG.h('span', null, B('Complement rule: '), "P(not A) = 1 − P(A).")),
        BG.demoProbability(),
        P('Three distributions appear in this lesson: ', B('normal'), ' (bell-shaped, e.g. adult height), ', B('binomial'), ' (number of successes in a fixed number of yes/no trials) and ', B('Poisson'), ' (number of events in a fixed time or space, e.g. ER arrivals per hour). Unit 4 covers them in depth.')),
      card('Testing an idea',
        P('A study starts by assuming ', B('H0: no effect'), '. The ', B('p-value'), ' asks: if H0 were true, how surprising would our data be? A small p (below the chosen α, usually 0.05) means "too surprising", so we reject H0.'),
        list('Type I error (α): rejecting H0 that is true, a false alarm.', 'Type II error (β): missing a real effect.', 'Power = 1 − β. It rises with sample size, effect size and α, and falls with more variability.'),
        mnemonic('p is small → reject the null', 'If p < α, reject H0.'),
        P('A ', B('95% confidence interval'), ' gives the plausible range for the true effect. If it contains the "no effect" value, the result is not statistically significant.'),
        BG.demoCI())
    ],
    bookNotes: [
      'p. 10 says "Mean, Median, Mode" are in increasing order. That is only true for left-skewed data. For right-skewed data (common in medicine, e.g. length of stay) the order is mode < median < mean. For symmetric data all three are about equal. Use the lab above to see this.',
      'p. 9 gives 0 as the example "null value" for a confidence interval. That applies to differences. For ratios such as RR or OR the null value is 1.',
      'The "POWERR" mnemonic on p. 10 is garbled in the book, so it is left out here. The factors it lists are covered in "Testing an idea".'
    ],
    games: ['sorter', 'spread']
  },
  // ------------------------------------------------------------------ 1.2
  {
    id: '1-2', num: '1.2', unit: 1, title: 'Overview of Epidemiology', pages: '11–15',
    terms: {
      'Epidemiology': 'The study of how often diseases occur, in whom, where and why, in populations.',
      'Incidence': 'New cases during a period of time.',
      'Prevalence': 'All existing cases (new and old) at a point in time.',
      'Mortality rate': 'Deaths from a cause in a population during a period.',
      'Observational study': 'The researcher watches; no intervention is assigned.',
      'Experimental study': 'The researcher assigns an intervention.',
      'Relative risk (RR)': 'Risk in the exposed ÷ risk in the unexposed.',
      'Odds ratio (OR)': 'Odds of exposure in cases ÷ odds of exposure in controls.',
      'Attributable risk (AR)': 'Risk in the exposed − risk in the unexposed.',
      'Bias': 'A systematic error that pushes results away from the truth.',
      'Confounding': 'A third factor linked to both exposure and outcome distorts their apparent link.',
      'Sensitivity': 'Of people with the disease, the share who test positive.',
      'Specificity': 'Of people without the disease, the share who test negative.',
      'PPV': 'Of positive tests, the share who truly have the disease.',
      'NPV': 'Of negative tests, the share who truly do not have the disease.'
    },
    sections: () => [
      card('What epidemiology asks',
        P('Epidemiology studies the ', B('occurrence'), ' (how often), ', B('distribution'), ' (in whom, where, when) and ', B('determinants'), ' (why) of disease in populations. It finds risk factors, guides prevention and checks whether interventions work.')),
      card('Incidence vs prevalence',
        P(B('Incidence'), ' counts new cases over a period. ', B('Prevalence'), ' counts everyone who has the disease at one moment. Picture a bathtub: incidence is the tap, prevalence is the water level, and recovery or death are the drains.'),
        mnemonic('Incidence is Incoming, Prevalence is Present', ''),
        BG.demoBathtub(),
        P('For a stable situation, ', B('prevalence ≈ incidence × average duration'), '. Long-lasting diseases (diabetes, HIV on treatment) have high prevalence even with modest incidence.'),
        P(B('Mortality rate'), ' = deaths from a specific cause in a population over a stated period.')),
      card('Study designs at a glance',
        P(B('Observational'), ': cross-sectional (one snapshot), cohort (follow forward from exposure), case-control (start from disease, look back). ', B('Experimental'), ': the investigator assigns the treatment, ideally by chance in a randomized controlled trial (RCT). Unit 2 goes deeper.')),
      card('Measuring association: the 2×2 table',
        BG.demo2x2(),
        list('RR is natural in cohort studies, where you follow exposed and unexposed people and measure risk directly.',
          'OR is used in case-control studies, where you cannot measure risk because you chose people by disease status.',
          'When the disease is rare, OR ≈ RR.')),
      card('Bias and confounding',
        list(BG.h('span', null, B('Selection bias: '), 'the people studied do not represent the target population.'),
          BG.h('span', null, B('Information bias: '), 'exposure or outcome is measured or classified wrongly.'),
          BG.h('span', null, B('Confounding: '), 'a third factor linked to both exposure and outcome creates a false link (Lesson 2.4 shows one live).'))),
      card('Screening and diagnostic tests',
        BG.demoTestGrid(),
        mnemonic('SnNOut', 'Highly Sensitive test, Negative result, rules Out disease.'),
        mnemonic('SpPIn', 'Highly Specific test, Positive result, rules In disease.'),
        P('Sensitivity and specificity belong to the test. PPV and NPV also depend on how common the disease is in the people tested.'))
    ],
    bookNotes: [
      'p. 13 calls attributable risk "the proportion of disease cases" due to an exposure. Strictly, attributable risk is a difference (risk exposed − risk unexposed). The proportion version is the attributable fraction, (RR − 1)/RR. Unit 10 of the book covers both.',
      'p. 14 says effect modification is "rare". That is not a reliable rule. Effect modification (the effect differs between subgroups) is common and is worth reporting, not removing. It is left out of the games.'
    ],
    games: ['bathtub']
  },
  // ------------------------------------------------------------------ 1.3
  {
    id: '1-3', num: '1.3', unit: 1, title: 'Importance of Biostatistics and Epidemiology in Medicine', pages: '16–17',
    terms: {
      'Evidence-based medicine (EBM)': 'Combining the best research evidence with clinical expertise and patient values.',
      'Diagnostic accuracy': 'How well a test separates people with and without a disease (sensitivity, specificity, predictive values, likelihood ratios).',
      'Likelihood ratio': 'How much a test result changes the odds of disease.',
      'Treatment effectiveness': 'Whether an intervention works, judged mainly by RCTs and systematic reviews.',
      'Meta-analysis': 'Statistically pooling the results of several studies.',
      'Risk factor': 'A characteristic linked to a higher chance of disease (genetic, environmental, behavioural).',
      'Disease surveillance': 'Ongoing monitoring of disease patterns to spot outbreaks and trends.',
      'PICO': 'Patient/Population, Intervention, Comparison, Outcome: the four parts of a clinical question.'
    },
    sections: () => [
      card('Evidence-based medicine',
        P('EBM is where three things overlap. Biostatistics and epidemiology supply the "best research evidence" circle.'),
        BG.demoEBM()),
      card('Where these fields show up in practice',
        list(BG.h('span', null, B('Designing studies: '), 'choosing sample size, randomization and control groups.'),
          BG.h('span', null, B('Analyzing data: '), 'picking the right test so the conclusion is sound.'),
          BG.h('span', null, B('Diagnosis: '), 'sensitivity, specificity, predictive values, likelihood ratios.'),
          BG.h('span', null, B('Treatment: '), 'RCTs and systematic reviews/meta-analyses show what works.'),
          BG.h('span', null, B('Risk factors: '), 'relative risk and odds ratios measure how strong a link is.'),
          BG.h('span', null, B('Public health: '), 'surveillance spots outbreaks; evaluation shows whether vaccination or health campaigns work.'))),
      card('Asking a good clinical question: PICO',
        P('A vague question ("Is drug X good?") cannot be searched or answered. PICO makes it precise:'),
        BG.h('div', { class: 'pico-demo' },
          [['P', 'Patient / Population', 'Adults with type 2 diabetes'], ['I', 'Intervention', 'adding an SGLT2 inhibitor'],
            ['C', 'Comparison', 'metformin alone'], ['O', 'Outcome', 'hospital admission for heart failure']].map(([l, n, ex]) =>
            BG.h('div', { class: 'pico-row' }, BG.h('span', { class: 'pico-letter' }, l), BG.h('span', { class: 'pico-name' }, n), BG.h('span', { class: 'pico-ex' }, ex)))),
        P('"In adults with type 2 diabetes, does adding an SGLT2 inhibitor, compared with metformin alone, reduce heart-failure admissions?"'))
    ],
    bookNotes: [],
    games: ['pico']
  },
  // ------------------------------------------------------------------ 2.1
  {
    id: '2-1', num: '2.1', unit: 2, title: 'Types of Study Designs (Observational and Experimental)', pages: '18–21',
    terms: {
      'Cross-sectional study': 'Measures exposure and outcome at one point in time ("snapshot"); gives prevalence.',
      'Prospective cohort': 'Groups people by exposure now and follows them into the future.',
      'Retrospective cohort': 'Uses historical records to group people by past exposure and trace outcomes to the present.',
      'Case-control study': 'Starts with people who have the disease (cases) and without (controls), then compares past exposure.',
      'Randomized controlled trial (RCT)': 'Participants are randomly assigned to intervention or control.',
      'Crossover study': 'Each participant receives the interventions in sequence and acts as their own control.',
      'Quasi-experimental study': 'An intervention study without randomization or without a proper control group.'
    },
    sections: () => [
      card('The first question: did the investigator assign the exposure?',
        BG.h('div', { class: 'decision' },
          BG.h('div', { class: 'dq' }, 'Investigator assigns the exposure?'),
          BG.h('div', { class: 'dbranches' },
            BG.h('div', { class: 'dbranch' }, BG.h('div', { class: 'dlabel' }, 'Yes → experimental'),
              list('Random allocation → RCT', 'Each person gets both, in turn → crossover', 'Not random / no control → quasi-experimental')),
            BG.h('div', { class: 'dbranch' }, BG.h('div', { class: 'dlabel' }, 'No → observational'),
              list('One moment in time → cross-sectional', 'Start from exposure, follow to outcome → cohort', 'Start from outcome, look back → case-control'))))),
      card('Which way does time run?', BG.demoTimelines()),
      card('Memory hooks',
        mnemonic('Snapshot study', 'Cross-sectional: a photo of the population at one moment.'),
        mnemonic('Cohort and continue', 'Follow a group over time.'),
        mnemonic('Cases vs controls', 'Compare people with and without the disease.'),
        mnemonic('Switch and compare', 'Crossover: participants switch treatments.'),
        mnemonic('Almost experimental', 'Quasi-experimental: like a trial, minus randomization.'))
    ],
    bookNotes: [
      'The book lists prospective and retrospective cohorts on p. 18. A retrospective cohort still runs from exposure to outcome. The researcher just reads it from old records. A case-control study runs the other way, from outcome back to exposure.'
    ],
    games: ['designs']
  },
  // ------------------------------------------------------------------ 2.2
  {
    id: '2-2', num: '2.2', unit: 2, title: 'Randomization and Control Groups', pages: '22–24',
    terms: {
      'Randomization': 'Assigning participants to groups by chance so that the groups are comparable.',
      'Control group': 'Participants who do not receive the intervention being studied; the baseline for comparison.',
      'Active control': 'The control group receives an existing standard treatment.',
      'Placebo control': 'The control group receives an inactive look-alike treatment.',
      'Single-blind': 'Participants do not know their group.',
      'Double-blind': 'Participants and researchers do not know.',
      'Triple-blind': 'Participants, researchers and outcome assessors do not know.',
      'Placebo effect': 'Improvement caused by the expectation of benefit, not by the treatment itself.'
    },
    sections: () => [
      card('Why randomize?',
        P('If doctors pick who gets the new drug, they may give it to healthier patients. Then the drug looks better even if it does nothing. That is ', B('selection bias'), '. A coin flip cannot be influenced, so the groups end up alike in known ', B('and unknown'), ' factors.'),
        BG.demoRandomizer(),
        mnemonic('Randomness reduces bias', '')),
      card('Control groups',
        P('The control group gives a ', B('baseline for comparison'), '. Many patients improve on their own (natural course, spontaneous recovery). Without a control group you cannot tell that apart from a drug effect.'),
        list(BG.h('span', null, B('Active control: '), 'gets the current standard treatment. Asks "is the new one better than what we use?"'),
          BG.h('span', null, B('Placebo control: '), 'gets an inactive look-alike. Separates the true drug effect from the ', B('placebo effect'), ', which is improvement from expecting to get better.'))),
      card('Blinding (masking)',
        P('People who know the assignment can, without meaning to, change how they report symptoms, give care or judge outcomes. Blinding hides the assignment.'),
        BG.demoBlinding(),
        mnemonic('Blind to bias', 'Hiding the assignment prevents bias from expectations.'))
    ],
    bookNotes: [
      'The book (p. 23) defines triple-blind as participants, researchers and outcome assessors. Some sources name the data analysts as the third group instead. The games here follow the book.'
    ],
    games: ['randomizer', 'blinding']
  },
  // ------------------------------------------------------------------ 2.3
  {
    id: '2-3', num: '2.3', unit: 2, title: 'Sampling Techniques', pages: '25–28',
    terms: {
      'Simple random sampling': 'Everyone in the population has an equal chance of selection.',
      'Stratified sampling': 'Split the population into subgroups (strata), then randomly sample from each.',
      'Cluster sampling': 'Randomly choose whole groups (clusters, e.g. villages or schools) and study everyone in them.',
      'Systematic sampling': 'Pick every k-th person from a list after a random start.',
      'Convenience sampling': 'Take whoever is easy to reach. Quick, but prone to selection bias.',
      'Representative sample': 'A sample that resembles the population it came from.',
      'Generalizability': 'How well results apply to the wider population.'
    },
    sections: () => [
      card('Five ways to pick 20 people from 100', BG.demoSampling()),
      card('When to use which',
        BG.h('div', { class: 'tablewrap' }, BG.h('table', { class: 'simple' },
          BG.h('thead', null, BG.h('tr', null, BG.h('th', null, 'Method'), BG.h('th', null, 'How'), BG.h('th', null, 'Good for'), BG.h('th', null, 'Watch out'))),
          BG.h('tbody', null,
            [['Simple random', 'Everyone has an equal chance', 'Unbiased estimates', 'Needs a full list; small groups may be missed'],
              ['Stratified', 'Random sample within each subgroup', 'Making sure small subgroups are represented', 'Needs subgroup info in advance'],
              ['Cluster', 'Randomly choose whole groups', 'Large, spread-out populations; cheaper', 'People in a cluster are alike, so less precise'],
              ['Systematic', 'Every k-th person after a random start', 'Simple with an ordered list', 'Bias if the list has a repeating pattern'],
              ['Convenience', 'Whoever is available', 'Quick pilot work', 'Selection bias; poor generalizability']]
              .map((r) => BG.h('tr', null, r.map((c, i) => BG.h(i ? 'td' : 'th', null, c)))))))),
      card('Memory hooks',
        mnemonic('Equal opportunity sampling', 'Simple random: everyone has the same chance.'),
        mnemonic('Strata selection', 'Stratified: divide into strata, sample each.'),
        mnemonic('Clusters for convenience', 'Cluster: whole groups, fewer trips.'),
        mnemonic('Systematic and sequential', 'Every k-th person.'),
        mnemonic('Convenient but careful', 'Convenience: easy, but biased.'))
    ],
    bookNotes: [],
    games: ['sampling']
  },
  // ------------------------------------------------------------------ 2.4
  {
    id: '2-4', num: '2.4', unit: 2, title: 'Bias and Confounding in Study Design', pages: '29–31',
    terms: {
      'Selection bias': 'The study participants are not representative of the target population.',
      'Healthy-volunteer bias': 'People who volunteer tend to be healthier than the general population.',
      "Berkson's bias": 'Hospital patients used as controls distort associations because they are not typical of the population.',
      'Recall bias': 'Groups remember past exposures with different accuracy (cases often search their memory harder).',
      'Reporting (publication) bias': 'Positive or significant results are more likely to be published.',
      'Confounder': 'A third variable linked to both the exposure and the outcome, which distorts their association.',
      'Matching': 'Making groups similar on a potential confounder when choosing participants.',
      'Stratification': 'Analyzing the data separately within levels of a confounder.',
      'Multivariable regression': 'A model that includes confounders as covariates to adjust for them.'
    },
    sections: () => [
      card('Bias: systematic error',
        P('Random error shrinks as samples get bigger. ', B('Bias does not'), '. It pushes results in one direction however large the study is.'),
        list(BG.h('span', null, B('Selection bias'), ' including ', B('healthy-volunteer'), ' (volunteers are healthier than average) and ', B("Berkson's"), ' (hospital controls are not typical people).'),
          BG.h('span', null, B('Recall bias: '), 'mothers of babies with a birth defect may remember medicines taken in pregnancy better than other mothers.'),
          BG.h('span', null, B('Reporting / publication bias: '), 'exciting positive results get published, so the published literature overstates effects.'))),
      card('Confounding: the hidden third factor', BG.demoConfounding(),
        P('A confounder must be ', B('linked to the exposure'), ', ', B('a cause of the outcome'), ', and ', B('not a step in between'), '.')),
      card('How to deal with confounding',
        BG.h('div', { class: 'two-col' },
          BG.h('div', null, BG.h('h5', null, 'When designing the study'), list('Randomization (balances known and unknown confounders)', 'Matching (pick controls similar on the confounder)')),
          BG.h('div', null, BG.h('h5', null, 'When analyzing the data'), list('Stratification (analyze within each level)', 'Multivariable regression (add the confounder as a covariate)')))),
      card('Memory hooks',
        mnemonic('Selection skews results', ''), mnemonic('Recall is reckless', 'Recall bias tends to exaggerate associations.'),
        mnemonic('Confounding causes confusion', ''), mnemonic('Adjust to account', 'Adjust in the analysis to account for confounders.'))
    ],
    bookNotes: [
      'p. 30 says healthy-volunteer bias leads to "overestimation of treatment effects", while the mnemonic on the same page says "underestimation of treatment risks". The core idea is that volunteers are healthier than the population, so results may not generalize and outcomes look better than they will in typical patients.',
      'p. 30 calls selective publication "reporting bias". It is more often called publication bias. "Reporting bias" can also mean selectively reporting some outcomes within one study.'
    ],
    games: ['bias']
  }
];

BG.lessonIndex = (id) => BG.LESSONS.findIndex((l) => l.id === id);
