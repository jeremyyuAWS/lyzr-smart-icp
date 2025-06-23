Here’s a concise, structured **appendix-style PRD extension** you can add to your core PRD to reflect the improvements and differentiators discussed:

---

## 📘 **Appendix: ICP Generator Enhancements & Differentiators**

### 🔄 **1. Signal-Aware Lead Evaluation**

**Module Name:** `SignalEvaluatorAgent`
**Purpose:** Detect weak/incomplete leads and recommend enrichment path.
**Logic:**

* Flag leads missing critical fields (e.g., email, job title, summary)
* Recommend next action:

  * “Re-run with Perplexity”
  * “Enrich via Apollo”
  * “Mark for manual review”

---

### 🧠 **2. Lead Persona Clustering**

**Module Name:** `LeadClusterAgent`
**Purpose:** Auto-group leads into behavioral segments.
**Output Examples:**

* “Bootstrapped eComm brands hiring social managers”
* “Franchise restaurants with <50 employees and low web presence”

**Benefits:** Better segmentation → smarter campaigns.

---

### 📈 **3. Intent Signal Overlay (Optional)**

**Module Name:** `IntentOverlayAgent`
**Function:** Ingest behavioral signals from sources like:

* LinkedIn posting frequency
* Ad library presence
* Keyword mentions
* News/PR updates

**Data Sources:** Manual ingest, SERP API, optional SimilarWeb/Bombora API (Phase 2).

---

### 🔁 **4. Lead Lifecycle Tracker**

**Module Name:** `LeadOutcomeTracker`
**Function:** Allow user to mark:

* “Contacted?”
* “Replied?”
* “Converted?”

**Stored In:** `/data/feedback/lead_feedback.json`
**Benefits:** Creates learning loop for improving scoring model.

---

### 🧬 **5. Multi-Lead Account Threading**

**Module Name:** `AccountRollupAgent`
**Function:** Group leads by domain/org and show account-level view.

**Example Output:**

```json
{
  "company": "GreenerHomes Inc",
  "contacts": [
    {"name": "Samantha", "title": "COO"},
    {"name": "Jorge", "title": "Facilities Manager"}
  ],
  "org_score": 92
}
```

**Use Case:** Mid-market SaaS, solar installers, or any multi-contact sale.

---

### 📊 **6. Transparent Scoring Breakdown**

**Module Name:** `ScorecardRenderer`
**Function:** Show users *why* a lead is ranked highly/poorly.

**UI Output Example:**

```
✔️ Match: Industry = Healthcare  
✔️ Region = Northeast  
✔️ Signal: Hiring Marketing Lead  
✖️ Email = Generic (info@)
```

**File:** `/data/scoring/scorecards.json`

---

## 💎 **Differentiator Summary (Slide-Friendly)**

| Feature                      | Differentiates From       |
| ---------------------------- | ------------------------- |
| Transparent scorecards       | Apollo, ZoomInfo          |
| AI-driven lead clustering    | Generic CSV uploads       |
| Signal-aware follow-up logic | Basic scraping tools      |
| Lead lifecycle feedback loop | Static databases          |
| Modular + toggled agents     | Monolithic enrichment UIs |
| Industry-agnostic onboarding | Niche vertical tools      |
