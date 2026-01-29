# 🎵 K-pop Physical Album vs Digital Streaming Analysis  
### Data-driven comparison of fandom-driven sales and mass popularity

---

## 📌 Project Summary
This project analyzes the structural differences between **physical album sales** and **digital streaming performance** in the K-pop industry.  
By leveraging Spotify streaming data and Circle Chart album/digital rankings, the study explores how **fandom-based consumption** and **mass popularity** diverge in the post-COVID music market.

> Focus: Understanding why chart performance differs across platforms and what variables actually drive each outcome.

---

## 🔍 Research Questions
- **RQ1**: What factors influence digital streaming scores and physical album sales?
- **RQ2**: Is there a meaningful correlation between physical album rankings and digital streaming rankings?
- **RQ3**: How do the characteristics of artists differ between digital charts and album charts?

---

## 🗂️ Data Sources
| Category | Description |
|--------|------------|
| Global Streaming | Spotify API (streaming counts, rankings) |
| Domestic Charts | Circle Chart (Digital & Album Charts) |
| Period | 2018–2023 |
| Target | Major K-pop artists & albums |

- Spotify chosen for global representativeness and API accessibility  
- Circle Chart used as Korea’s official aggregated chart (digital + physical)

---

## 🛠 Methodology
- Data preprocessing & feature encoding  
  (artist gender, debut year, chart rank, etc.)
- Exploratory Data Analysis (EDA)
- **OLS Regression Analysis**
- Statistical assumption checks  
  (normality, independence, homoscedasticity)
- Correlation analysis & visualization
- Comparative analysis of top-ranked artists by chart type

---

## 📈 Key Findings

### 1️⃣ Factors Affecting Album Sales & Streaming
- Chart rank strongly correlates with album sales  
- However, **severe multicollinearity** observed when rank is included
- Simple regression shows **very low explanatory power** of streaming score on album sales  
  - R² ≈ 0.015

---

### 2️⃣ Correlation Between Digital & Physical Charts
- High correlation coefficient observed among top-ranked samples
- But results **lack statistical significance** due to sampling bias  
  (only top-ranked data points used)

---

### 3️⃣ Structural Difference Between Charts
**Digital Chart**
- Higher proportion of solo artists & female artists  
- Reflects general public listening behavior

**Album Chart**
- Dominated by **male idol groups**
- Strongly driven by fandom purchasing power
- All artists with 10+ album chart entries were male groups

---

## ⚠️ Limitations
- Physical albums have a **fixed sales window**  
  → No long-term “reverse charting” like digital songs
- Post-COVID **album sales inflation**
- Changes in Circle Chart scoring methodology limit year-to-year comparability

---

## 💡 Implications
- Digital streaming and physical album sales operate under **fundamentally different consumption logics**
- K-pop success metrics should separate:
  - **Global popularity (streaming)**
  - **Fandom loyalty (album sales)**
- Highlights the need for **platform-aware analysis** in music data research

---

## 🧪 Tech Stack
- **Python**
  - pandas, numpy
  - statsmodels
  - matplotlib
- Spotify Developer API
- Regression & data visualization

---

## 📎 Notes
This project was conducted as an academic data analysis study and can be extended to:
- Predictive modeling of album sales
- Country-level streaming comparisons
- Short-form (TikTok) signal integration

---
