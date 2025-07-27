# Matching Algorithms - Technical Deep Dive

This document provides detailed explanations of the six core algorithms used in the Himalayan Wander Connect matching system for calculating compatibility between trekking partners.

## 1. Jaccard Similarity Coefficient

### Overview
The Jaccard Similarity Coefficient measures similarity between two sets by calculating the ratio of intersection to union. In our context, it determines how similar two users' interests are.

### Mathematical Definition
For two sets A and B:
```
Jaccard(A,B) = |A ∩ B| / |A ∪ B|
```

Where:
- `|A ∩ B|` = size of intersection (common elements)
- `|A ∪ B|` = size of union (all unique elements)

### Implementation

```typescript
calculateInterestCompatibility(user1: UserProfile, user2: UserProfile): number {
  // Convert interests to lowercase sets for case-insensitive comparison
  const interests1 = new Set(user1.interests.map(i => i.toLowerCase()));
  const interests2 = new Set(user2.interests.map(i => i.toLowerCase()));
  
  // Calculate intersection (common interests)
  const intersection = new Set([...interests1].filter(i => interests2.has(i)));
  
  // Calculate union (all unique interests)
  const union = new Set([...interests1, ...interests2]);
  
  // Jaccard similarity coefficient
  const jaccardSimilarity = intersection.size / union.size;
  
  // Bonus system to reward strong overlaps
  const sharedCount = intersection.size;
  const bonus = sharedCount >= 3 ? 0.1 : sharedCount >= 2 ? 0.05 : 0;
  
  // Ensure result doesn't exceed 1.0
  return Math.min(1.0, jaccardSimilarity + bonus);
}
```

### Example Calculation

**User A Interests**: ["Photography", "Annapurna Circuit", "Cultural Exploration", "High Altitude"]
**User B Interests**: ["Photography", "Cultural Exploration", "Solo Travel", "Digital Detox"]

**Step 1: Identify Sets**
- Set A = {photography, annapurna circuit, cultural exploration, high altitude}
- Set B = {photography, cultural exploration, solo travel, digital detox}

**Step 2: Calculate Intersection**
- A ∩ B = {photography, cultural exploration}
- |A ∩ B| = 2

**Step 3: Calculate Union**
- A ∪ B = {photography, annapurna circuit, cultural exploration, high altitude, solo travel, digital detox}
- |A ∪ B| = 6

**Step 4: Apply Jaccard Formula**
- Jaccard(A,B) = 2/6 = 0.333

**Step 5: Apply Bonus**
- Shared count = 2 → Bonus = 0.05
- Final Score = 0.333 + 0.05 = **0.383 (38.3%)**

### Bonus System Logic
```
Bonus = {
  0.1   if shared_interests ≥ 3
  0.05  if shared_interests = 2  
  0     if shared_interests ≤ 1
}
```

### Properties
- **Range**: [0, 1] where 0 = no similarity, 1 = identical
- **Symmetry**: Jaccard(A,B) = Jaccard(B,A)
- **Boundary Cases**: 
  - Empty sets: Jaccard(∅,∅) = 0/0 → handled as 0
  - Identical sets: Jaccard(A,A) = |A|/|A| = 1

---

## 2. Level Difference Calculation

### Overview
This algorithm assesses compatibility between users based on their trekking experience levels and completed trek counts, ensuring safety and pace compatibility.

### Experience Level Mapping
```typescript
const experienceLevels = { 
  'Beginner': 1, 
  'Intermediate': 2, 
  'Advanced': 3 
};
```

### Algorithm Implementation

```typescript
calculateExperienceCompatibility(user1: UserProfile, user2: UserProfile): number {
  const level1 = experienceLevels[user1.experience] || 2;
  const level2 = experienceLevels[user2.experience] || 2;
  
  // Level compatibility scoring
  const levelDiff = Math.abs(level1 - level2);
  const levelScore = levelDiff === 0 ? 1.0 :     // Same level
                     levelDiff === 1 ? 0.8 :     // 1 level difference  
                     0.4;                         // 2+ level difference
  
  // Trek count compatibility
  const minTreks = Math.min(user1.completedTreks, user2.completedTreks);
  const maxTreks = Math.max(user1.completedTreks, user2.completedTreks, 1);
  const trekRatio = minTreks / maxTreks;
  
  // Normalize trek score between 0.3 and 1.0
  const trekScore = trekRatio * 0.7 + 0.3;
  
  // Weighted combination: 70% level, 30% trek count
  return levelScore * 0.7 + trekScore * 0.3;
}
```

### Mathematical Formula

**Level Score**:
```
levelScore = {
  1.0  if |level1 - level2| = 0
  0.8  if |level1 - level2| = 1
  0.4  if |level1 - level2| ≥ 2
}
```

**Trek Score**:
```
trekRatio = min(treks1, treks2) / max(treks1, treks2, 1)
trekScore = trekRatio × 0.7 + 0.3
```

**Final Score**:
```
experienceScore = levelScore × 0.7 + trekScore × 0.3
```

### Example Calculation

**User A**: Intermediate (level 2), 8 completed treks
**User B**: Advanced (level 3), 15 completed treks

**Step 1: Level Compatibility**
- Level difference = |2 - 3| = 1
- Level score = 0.8 (1 level difference allowed)

**Step 2: Trek Count Compatibility**
- Trek ratio = min(8, 15) / max(8, 15) = 8/15 = 0.533
- Trek score = 0.533 × 0.7 + 0.3 = 0.673

**Step 3: Weighted Combination**
- Final score = 0.8 × 0.7 + 0.673 × 0.3 = 0.56 + 0.202 = **0.762 (76.2%)**

### Design Rationale
- **Safety First**: Large experience gaps can be dangerous
- **Pace Matching**: Similar experience levels ensure compatible hiking speeds
- **Learning Opportunity**: 1-level difference allows mentoring relationships
- **Trek Count**: Experience quantity matters beyond just level classification

---

## 3. Regional Grouping System

### Overview
This algorithm groups Nepal's cities into regions and calculates location-based compatibility, considering that closer locations make meetups and planning more convenient.

### Regional Definitions

```typescript
const regions = {
  central: ['kathmandu', 'lalitpur', 'bhaktapur'],
  western: ['pokhara', 'butwal'],
  eastern: ['biratnagar', 'dharan', 'itahari'],
  southern: ['birgunj', 'janakpur', 'hetauda']
};
```

### Geographic Context
- **Central Region**: Capital area with high population density
- **Western Region**: Tourist hubs and trekking gateways
- **Eastern Region**: Industrial and commercial centers
- **Southern Region**: Border towns and Terai plains

### Algorithm Implementation

```typescript
calculateLocationCompatibility(user1: UserProfile, user2: UserProfile): number {
  const location1 = user1.location.toLowerCase();
  const location2 = user2.location.toLowerCase();
  
  // Same city = perfect compatibility
  if (location1 === location2) {
    return 1.0;
  }
  
  // Function to determine region for a location
  const getUserRegion = (location: string) => {
    for (const [region, cities] of Object.entries(regions)) {
      if (cities.includes(location)) {
        return region;
      }
    }
    return 'other'; // Cities not in defined regions
  };
  
  const region1 = getUserRegion(location1);
  const region2 = getUserRegion(location2);
  
  // Same region = good compatibility, different region = lower compatibility
  return region1 === region2 ? 0.7 : 0.3;
}
```

### Scoring Logic

```
Score = {
  1.0  if same city
  0.7  if same region, different city
  0.3  if different region
}
```

### Example Calculations

**Example 1**: Kathmandu ↔ Lalitpur
- Same region (Central) → Score = **0.7**

**Example 2**: Pokhara ↔ Pokhara  
- Same city → Score = **1.0**

**Example 3**: Kathmandu ↔ Pokhara
- Different regions (Central vs Western) → Score = **0.3**

**Example 4**: Dharan ↔ Unknown City
- Unknown city classified as 'other' → Score = **0.3**

### Distance Approximation

While we don't use exact GPS coordinates, the regional system approximates:

| Region Pair | Approximate Distance | Travel Time | Score |
|-------------|---------------------|-------------|-------|
| Same city | 0-30 km | 0-1 hour | 1.0 |
| Same region | 30-150 km | 1-4 hours | 0.7 |
| Different region | 150-800 km | 4-12 hours | 0.3 |

### Extensibility
The system can easily accommodate:
- New cities by adding to existing regions
- New regions by extending the regions object
- Sub-regional groupings for finer granularity
- GPS-based distance calculation for exact measurements

---

## 4. Circular Month Distance

### Overview
This algorithm calculates how close two users' trek availability months are, accounting for the circular nature of the calendar year (December is adjacent to January).

### Mathematical Concept

In a circular system, the distance between two points is the minimum of:
1. Direct distance: |month1 - month2|
2. Wraparound distance: 12 - |month1 - month2|

### Algorithm Implementation

```typescript
calculateAvailabilityCompatibility(user1: UserProfile, user2: UserProfile): number {
  // Handle missing availability data
  if (!user1.availability || !user2.availability) {
    return 0.5; // Neutral score for missing data
  }
  
  // Month name to index mapping
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  // Extract month from availability string (e.g., "April 2025" → "april")
  const getMonth = (availability: string) => {
    const month = availability.toLowerCase().split(' ')[0];
    return months.indexOf(month);
  };
  
  const month1 = getMonth(user1.availability);
  const month2 = getMonth(user2.availability);
  
  // Same month = perfect timing
  if (month1 === month2) {
    return 1.0;
  }
  
  // Calculate circular distance
  const directDistance = Math.abs(month1 - month2);
  const circularDistance = Math.min(directDistance, 12 - directDistance);
  
  // Score based on circular distance
  if (circularDistance === 1) return 0.8;      // Adjacent months
  if (circularDistance === 2) return 0.6;      // 2 months apart
  if (circularDistance <= 3) return 0.4;       // Same season
  return 0.2;                                   // Different seasons
}
```

### Circular Distance Formula

```
circularDistance = min(|month1 - month2|, 12 - |month1 - month2|)
```

### Scoring Table

| Example Months | Direct Distance | Circular Distance | Score | Interpretation |
|----------------|-----------------|-------------------|-------|----------------|
| April ↔ April | 0 | 0 | 1.0 | Same month |
| April ↔ May | 1 | 1 | 0.8 | Adjacent months |
| April ↔ March | 1 | 1 | 0.8 | Adjacent months |
| January ↔ December | 11 | 1 | 0.8 | Adjacent (wraparound) |
| April ↔ June | 2 | 2 | 0.6 | 2 months apart |
| April ↔ July | 3 | 3 | 0.4 | Same season |
| April ↔ October | 6 | 6 | 0.2 | Different seasons |

### Example Calculations

**Example 1**: "April 2025" ↔ "May 2025"
- month1 = 3, month2 = 4
- directDistance = |3 - 4| = 1
- circularDistance = min(1, 12 - 1) = 1
- Score = **0.8** (adjacent months)

**Example 2**: "December 2024" ↔ "January 2025"  
- month1 = 11, month2 = 0
- directDistance = |11 - 0| = 11
- circularDistance = min(11, 12 - 11) = min(11, 1) = 1
- Score = **0.8** (adjacent months via wraparound)

**Example 3**: "March 2025" ↔ "September 2025"
- month1 = 2, month2 = 8  
- directDistance = |2 - 8| = 6
- circularDistance = min(6, 12 - 6) = 6
- Score = **0.2** (different seasons)

### Seasonal Context

The scoring reflects Nepal's trekking seasons:

- **Spring (Mar-May)**: Peak season, good weather
- **Autumn (Sep-Nov)**: Peak season, clear views  
- **Winter (Dec-Feb)**: Cold but possible in lower elevations
- **Summer (Jun-Aug)**: Monsoon season, challenging conditions

Adjacent months often share similar weather patterns, justifying the high compatibility score.

---

## 5. Shared Language Counting

### Overview
This algorithm evaluates communication compatibility by counting shared languages between users, using a stepped scoring system that reflects communication quality levels.

### Algorithm Implementation

```typescript
calculateLanguageCompatibility(user1: UserProfile, user2: UserProfile): number {
  // Normalize languages to lowercase for case-insensitive comparison
  const languages1 = new Set(user1.languages.map(l => l.toLowerCase()));
  const languages2 = new Set(user2.languages.map(l => l.toLowerCase()));
  
  // Find intersection of language sets
  const sharedLanguages = new Set([...languages1].filter(l => languages2.has(l)));
  const sharedCount = sharedLanguages.size;
  
  // Stepped scoring based on shared language count
  if (sharedCount === 0) return 0.0;       // No communication possible
  if (sharedCount === 1) return 0.7;       // Basic communication
  if (sharedCount >= 2) return 1.0;        // Excellent communication
  
  return 0.5; // Fallback (should not reach here)
}
```

### Scoring Logic

```
Score = {
  0.0  if shared_languages = 0
  0.7  if shared_languages = 1  
  1.0  if shared_languages ≥ 2
}
```

### Communication Quality Levels

| Shared Languages | Score | Communication Level | Description |
|-----------------|-------|-------------------|-------------|
| 0 | 0.0 | **No Communication** | Requires translation apps or gestures |
| 1 | 0.7 | **Basic Communication** | Can handle essential trekking communication |
| 2+ | 1.0 | **Excellent Communication** | Multiple communication options, cultural nuance |

### Example Calculations

**Example 1**: User A ["English", "Nepali"] ↔ User B ["English", "Hindi"]
- languages1 = {english, nepali}
- languages2 = {english, hindi}  
- sharedLanguages = {english}
- sharedCount = 1
- Score = **0.7** (basic communication)

**Example 2**: User A ["English", "Nepali", "Hindi"] ↔ User B ["English", "Nepali"]
- languages1 = {english, nepali, hindi}
- languages2 = {english, nepali}
- sharedLanguages = {english, nepali}
- sharedCount = 2
- Score = **1.0** (excellent communication)

**Example 3**: User A ["Nepali", "Tibetan"] ↔ User B ["English", "French"]
- languages1 = {nepali, tibetan}
- languages2 = {english, french}
- sharedLanguages = {} (empty set)
- sharedCount = 0  
- Score = **0.0** (no communication)

### Language Context in Nepal

Common languages in Nepal trekking context:

- **English**: International communication, most guides speak it
- **Nepali**: National language, essential for local interaction
- **Hindi**: Widely understood due to cultural proximity
- **Mandarin**: Growing importance with Chinese tourists
- **Other regional languages**: Tibetan, Sherpa, etc.

### Design Rationale

**Why Stepped Scoring vs Linear?**
- Communication isn't linear with language count
- Having 1 vs 0 shared languages is a massive difference
- Having 2 vs 1 shared languages provides redundancy and nuance
- Beyond 2 languages, additional languages have diminishing returns

**Why These Specific Thresholds?**
- **0.0 for zero**: Communication barriers can be deal-breakers for safety
- **0.7 for one**: Adequate for basic trekking needs, but limited
- **1.0 for two+**: Excellent communication with backup options

---

## 6. Age Difference Calculations

### Overview
This algorithm calculates age compatibility using both absolute age differences and user-defined age preferences, with graduated scoring that reflects social and practical compatibility factors.

### Algorithm Implementation

```typescript
calculateAgeCompatibility(user1: UserProfile, user2: UserProfile, preferences: UserPreferences): number {
  const ageDiff = Math.abs(user1.age - user2.age);
  const targetAge = user2.age;
  
  // Check if target user is within preferred age range
  const withinPreferredRange = targetAge >= preferences.preferredAgeRange.min && 
                              targetAge <= preferences.preferredAgeRange.max;
  
  if (withinPreferredRange) {
    // Within preferred range - use graduated scoring
    if (ageDiff <= 3) return 1.0;        // Very close ages
    if (ageDiff <= 7) return 0.8;        // Close ages  
    if (ageDiff <= 12) return 0.6;       // Moderate difference
    return 0.4;                          // Large difference but still in range
  } else {
    // Outside preferred range - apply penalty
    return Math.max(0.1, 1.0 - (ageDiff / 50));
  }
}
```

### Scoring System

#### Within Preferred Age Range
```
Score = {
  1.0  if age_difference ≤ 3 years
  0.8  if age_difference ≤ 7 years
  0.6  if age_difference ≤ 12 years  
  0.4  if age_difference > 12 years
}
```

#### Outside Preferred Age Range
```
Score = max(0.1, 1.0 - age_difference/50)
```

### Smart Preference Generation

When users don't manually set preferences, the system auto-generates reasonable defaults:

```typescript
const smartPreferences = {
  preferredAgeRange: { 
    min: Math.max(18, userProfile.age - 10), 
    max: Math.min(70, userProfile.age + 10) 
  }
};
```

### Example Calculations

#### Example 1: Within Preferred Range
**User A**: Age 28, preferred range [18, 38]
**User B**: Age 26

- ageDiff = |28 - 26| = 2
- withinPreferredRange = true (26 is between 18 and 38)
- ageDiff ≤ 3 → Score = **1.0**

#### Example 2: Close but Outside Range  
**User A**: Age 25, preferred range [20, 30]
**User B**: Age 35

- ageDiff = |25 - 35| = 10
- withinPreferredRange = false (35 > 30)
- Penalty score = max(0.1, 1.0 - 10/50) = max(0.1, 0.8) = **0.8**

#### Example 3: Large Age Gap
**User A**: Age 25, preferred range [20, 35]  
**User B**: Age 50

- ageDiff = |25 - 50| = 25
- withinPreferredRange = false (50 > 35)
- Penalty score = max(0.1, 1.0 - 25/50) = max(0.1, 0.5) = **0.5**

#### Example 4: Very Large Gap
**User A**: Age 25, preferred range [20, 35]
**User B**: Age 70

- ageDiff = |25 - 70| = 45  
- withinPreferredRange = false (70 > 35)
- Penalty score = max(0.1, 1.0 - 45/50) = max(0.1, 0.1) = **0.1**

### Age Compatibility Matrix

| User Age | Partner Age | Age Diff | Within Range? | Score | Interpretation |
|----------|-------------|----------|---------------|-------|----------------|
| 25 | 26 | 1 | ✓ | 1.0 | Perfect match |
| 25 | 30 | 5 | ✓ | 0.8 | Close ages |
| 25 | 35 | 10 | ✓ | 0.6 | Moderate difference |
| 25 | 40 | 15 | ✓ | 0.4 | Large difference |
| 25 | 40 | 15 | ✗ | 0.7 | Outside range penalty |
| 25 | 60 | 35 | ✗ | 0.3 | Large gap penalty |
| 25 | 75 | 50 | ✗ | 0.1 | Maximum penalty |

### Design Rationale

#### Why Age Matters in Trekking
- **Physical capability**: Similar ages often have similar fitness levels
- **Pace compatibility**: Age affects hiking speed and endurance
- **Social compatibility**: Shared life experiences and perspectives
- **Risk tolerance**: Age influences approach to adventure and safety

#### Why Graduated Scoring?
- **Non-linear compatibility**: Small age differences matter less than large ones
- **Preference respect**: Users should have control over age ranges
- **Practical thresholds**: 3/7/12-year thresholds reflect real social dynamics

#### Penalty Function Design
The `1.0 - (ageDiff / 50)` formula:
- **Linear decay**: Gradually reduces score with increasing age gap
- **Reasonable floor**: Minimum score of 0.1 prevents complete elimination
- **50-year normalizer**: Based on maximum reasonable age span (70-20)

---

## Algorithm Integration

These six algorithms work together in the main compatibility calculation:

```typescript
const breakdown = {
  interestScore: calculateInterestCompatibility(user1, user2),           // Jaccard
  experienceScore: calculateExperienceCompatibility(user1, user2),      // Level difference  
  locationScore: calculateLocationCompatibility(user1, user2),          // Regional grouping
  availabilityScore: calculateAvailabilityCompatibility(user1, user2),  // Circular distance
  languageScore: calculateLanguageCompatibility(user1, user2),          // Shared counting
  ageScore: calculateAgeCompatibility(user1, user2, preferences)        // Age difference
};

// Weighted combination (30%, 25%, 15%, 15%, 10%, 5%)
const finalScore = 
  breakdown.interestScore * 0.30 +
  breakdown.experienceScore * 0.25 +
  breakdown.locationScore * 0.15 +
  breakdown.availabilityScore * 0.15 +
  breakdown.languageScore * 0.10 +
  breakdown.ageScore * 0.05;
```

Each algorithm contributes its expertise to create a comprehensive compatibility assessment that balances multiple dimensions of partner compatibility for safe and enjoyable trekking experiences. 