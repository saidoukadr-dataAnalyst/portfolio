/** Portfolio de Saïd. Les fiches isExample sont des modèles à personnaliser. */
const defaultPortfolioData = {
  "profile": {
    "name": "Saïd",
    "title": "Étudiant en 5e année Big Data & Intelligence Artificielle",
    "statusBadge": "À la recherche d’un stage PFE",
    "location": "UIR · Rabat, Maroc",
    "studyLabel": "5e année · Big Data & IA",
    "studyYear": "5e",
    "reportedInternships": 2,
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "kaggle": "",
    "cvPdfUrl": "",
    "shortBio": "Étudiant en 5e année Big Data & Intelligence Artificielle à l’Université Internationale de Rabat. Je recherche un stage PFE en data engineering ou data analysis pour mettre mes connaissances au service de projets concrets.",
    "aboutDescription": "Je suis Saïd, étudiant à l’Université Internationale de Rabat, en cinquième année de Big Data et Intelligence Artificielle.\n\nMon parcours comprend deux stages et des projets réalisés au cours de mes études. Je souhaite poursuivre cette expérience par un projet de fin d’études en data engineering ou data analysis.",
    "targetRole": "Un stage PFE en Data Engineering ou Data Analysis.",
    "contactIntro": "Je recherche un stage de fin d’études en data engineering ou data analysis. Échangeons sur vos besoins et les missions que je pourrais rejoindre.",
    "experienceIntro": "Deux stages réalisés pendant mon parcours. Leurs missions, technologies et résultats seront détaillés ici."
  },
  "skills": {
    "bigData": {
      "title": "Big Data & Distributed Computing",
      "icon": "database-zap",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "Apache Spark (PySpark)",
        "Apache Kafka",
        "Hadoop / HDFS",
        "Apache Airflow",
        "Delta Lake",
        "dbt Core",
        "Hive / Presto"
      ],
      "isExample": true
    },
    "aiAndMl": {
      "title": "Machine Learning & Deep Learning",
      "icon": "brain-circuit",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "PyTorch",
        "TensorFlow / Keras",
        "Scikit-Learn",
        "Hugging Face Transformers",
        "OpenCV",
        "XGBoost / LightGBM",
        "YOLOv8"
      ],
      "isExample": true
    },
    "genAi": {
      "title": "Generative AI & LLMs",
      "icon": "sparkles",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "LangChain",
        "LlamaIndex",
        "RAG (Retrieval Augmented Gen)",
        "ChromaDB / Milvus / Pinecone",
        "Ollama / vLLM",
        "Prompt Engineering"
      ],
      "isExample": true
    },
    "mlopsAndCloud": {
      "title": "MLOps, Cloud & DevOps",
      "icon": "cloud",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "Docker",
        "Kubernetes",
        "MLflow",
        "CI/CD (GitHub Actions)",
        "AWS (S3, EMR, SageMaker)",
        "Azure / GCP",
        "FastAPI / Flask"
      ],
      "isExample": true
    },
    "databases": {
      "title": "Bases de Données & Data Warehouse",
      "icon": "server",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "PostgreSQL",
        "MongoDB",
        "Cassandra",
        "Snowflake",
        "Redis",
        "Elasticsearch / OpenSearch",
        "Neo4j"
      ],
      "isExample": true
    },
    "languages": {
      "title": "Langages & Outils d'Analyse",
      "icon": "terminal",
      "description": "Exemples de technologies à personnaliser selon mon parcours et mes objectifs.",
      "items": [
        "Python",
        "SQL (Avancé)",
        "Scala / Java",
        "Bash / Linux",
        "Git / GitHub",
        "Power BI / Streamlit"
      ],
      "isExample": true
    }
  },
  "internships": [
    {
      "id": "stage-2",
      "role": "Stage Assistant Ingénieur MLOps & Data Engineer",
      "company": "TechData Solutions (Exemple)",
      "location": "Paris / Hybride",
      "duration": "Avril 2025 – Septembre 2025 (6 mois)",
      "type": "Stage 4ème/5ème Année",
      "badge": "Stage MLOps & Big Data",
      "summary": "Industrialisation de pipelines d'ingestion de données temps réel et mise en production de modèles de détection d'anomalies financières.",
      "fullDetails": {
        "context": "L'entreprise traitait plus de 3 millions de transactions par jour et souffrait d'une latence d'analyse trop élevée (24h) basée sur un ancien système batch.",
        "objective": "Migrer l'infrastructure vers un pipeline streaming temps réel avec Apache Kafka et PySpark Streaming, puis déployer un modèle de détection d'anomalies en production avec surveillance de la dérive (drift monitoring).",
        "responsibilities": [
          "Conception et implémentation du pipeline d'ingestion streaming avec Apache Kafka et PySpark.",
          "Développement d'une API de scoring en temps réel avec FastAPI et conteneurisation sous Docker.",
          "Mise en place du tracking d'expérimentations et du registre de modèles avec MLflow.",
          "Automatisation du déploiement via GitHub Actions (CI/CD) sur un cluster Kubernetes.",
          "Création d'un dashboard de monitoring temps réel sous Grafana et Streamlit pour les équipes conformité."
        ],
        "architecture": [
          {
            "step": "Source",
            "desc": "Transactions bancaires API REST"
          },
          {
            "step": "Ingestion",
            "desc": "Cluster Apache Kafka (3 brokers)"
          },
          {
            "step": "Traitement",
            "desc": "PySpark Structured Streaming"
          },
          {
            "step": "Inférence & Base",
            "desc": "FastAPI + MLflow + PostgreSQL & Redis"
          },
          {
            "step": "Dashboard",
            "desc": "Streamlit & Grafana Alerts"
          }
        ],
        "results": [
          "Réduction du temps de détection des anomalies de 24h à moins de 800 millisecondes.",
          "Traitement fluide d'un débit de pointe de 5 000 événements par seconde.",
          "Amélioration du score F1 du modèle de 0.81 à 0.93 grâce au feature engineering streaming.",
          "Documentation complète d'architecture technique validée par les architectes Cloud."
        ],
        "techStack": [
          "PySpark",
          "Apache Kafka",
          "FastAPI",
          "Docker",
          "MLflow",
          "PostgreSQL",
          "Redis",
          "GitHub Actions",
          "Python"
        ]
      },
      "isExample": true
    },
    {
      "id": "stage-1",
      "role": "Stage Data Analyst & Machine Learning",
      "company": "InnovAI Labs (Exemple)",
      "location": "Lyon / Télétravail",
      "duration": "Juin 2024 – Août 2024 (3 mois)",
      "type": "Stage 3ème/4ème Année",
      "badge": "Stage Data Science & BI",
      "summary": "Analyse prédictive du comportement client (Churn), modélisation supervisée et création de tableaux de bord décisionnels interactifs.",
      "fullDetails": {
        "context": "L'équipe marketing souhaitait identifier de manière proactive les clients à fort risque de désabonnement pour lancer des campagnes de rétention ciblées.",
        "objective": "Nettoyer et croiser plus de 500 000 lignes de données CRM, concevoir des modèles prédictifs de churn et automatiser le reporting pour les décideurs métiers.",
        "responsibilities": [
          "Extraction, nettoyage et consolidation de données hétérogènes (PostgreSQL, fichiers CSV logs, API Salesforce).",
          "Exploration statistique approfondie (EDA) et sélection des variables clés (Feature Importance, SHAP values).",
          "Entraînement et benchmark de plusieurs algorithmes de classification (Régression Logistique, Random Forest, XGBoost).",
          "Interprétabilité des prédictions à l'aide de la bibliothèque SHAP pour expliquer les décisions du modèle aux équipes métier.",
          "Création d'un dashboard Power BI connecté automatiquement à la base de données avec alertes de segmentation."
        ],
        "architecture": [
          {
            "step": "Ingestion",
            "desc": "SQL queries + Pandas Data Cleaning"
          },
          {
            "step": "Modélisation",
            "desc": "Scikit-Learn & XGBoost + Optuna Tuning"
          },
          {
            "step": "Explicabilité",
            "desc": "SHAP Values & Feature Importance"
          },
          {
            "step": "Restitution",
            "desc": "Tableaux de bord interactifs Power BI"
          }
        ],
        "results": [
          "Atteinte d'un score ROC-AUC de 0.89 avec le modèle XGBoost optimisé.",
          "Identification de 3 facteurs clés de churn non suspectés auparavant par la direction.",
          "Adoption immédiate du dashboard Power BI par une équipe de 15 account managers.",
          "Gain de 6 heures par semaine sur le reporting manuel grâce à l'automatisation du flux."
        ],
        "techStack": [
          "Python",
          "Scikit-Learn",
          "XGBoost",
          "Pandas",
          "SQL",
          "Power BI",
          "SHAP",
          "Matplotlib/Seaborn"
        ]
      },
      "isExample": true
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Recherche documentaire avec un assistant RAG",
      "category": "genai",
      "categoryLabel": "GenAI & LLMs",
      "academicYear": "5ème Année • Projet R&D Deep Learning",
      "summary": "Pipeline de questions-réponses RAG haute performance sur documentation technique avec LLaMA-3, LangChain et Vector Database.",
      "github": "",
      "demo": "",
      "technologies": [
        "LangChain",
        "LLaMA-3",
        "ChromaDB",
        "FastAPI",
        "HuggingFace",
        "Docker"
      ],
      "fullDetails": {
        "problem": "Les ingénieurs perdaient un temps considérable à rechercher des spécifications techniques au sein de milliers de pages de PDF hétérogènes.",
        "dataset": "Corpus de plus de 1 200 documents techniques d'ingénierie et documentations API.",
        "methodology": "Implémentation d'un pipeline RAG hybride combinant recherche dense (embeddings bge-large) et recherche sparse (BM25), suivi d'un reranking avec Cross-Encoder avant génération par le LLM.",
        "architecture": "Upload PDF → Chunking adaptatif → Embeddings → Indexation ChromaDB → Retrieval Hybride + Reranker → Prompt Contextuel → Modèle LLaMA-3 quantifié via Ollama/FastAPI.",
        "metrics": "Réduction des hallucinations mesurée avec le framework Ragas (Faithfulness: 0.94, Answer Relevance: 0.91). Temps moyen de réponse : 1.4s.",
        "keyLearnings": "Optimisation de la taille des chunks, gestion des métadonnées pour le filtrage sémantique et techniques de quantisation 4-bit."
      },
      "isExample": true
    },
    {
      "id": "proj-2",
      "title": "Streaming boursier & Data Lakehouse",
      "category": "bigdata",
      "categoryLabel": "Big Data & Streaming",
      "academicYear": "5ème Année • Projet Architecture Distribuée",
      "summary": "Pipeline de streaming temps réel traitant des flux de cotations financières avec Kafka, Spark Streaming, MinIO et Delta Lake.",
      "github": "",
      "demo": "",
      "technologies": [
        "Apache Kafka",
        "Apache Spark",
        "Delta Lake",
        "MinIO (S3)",
        "Docker Compose",
        "Streamlit"
      ],
      "fullDetails": {
        "problem": "Analyser des variations de prix haute fréquence et détecter des anomalies de volume sur des marchés financiers en direct.",
        "dataset": "Flux continu simulant plus de 10 000 ticks/seconde sur 500 actions boursières.",
        "methodology": "Architecture Medallion (Bronze / Silver / Gold) implémentée avec Delta Lake pour garantir les transactions ACID sur le stockage objet MinIO.",
        "architecture": "Producteur Kafka → Topics partitionnés → Ingestion Spark Streaming (Bronze) → Nettoyage & Agrégation par fenêtres temporelles (Silver) → Calcul RSI/MACD Gold → Dashboard Streamlit.",
        "metrics": "Traitement de 15 000 msg/sec avec un temps de bout-en-bout inférieur à 1.2s. Tolérance aux pannes vérifiée par checkpointing Spark.",
        "keyLearnings": "Gestion du backpressure dans Spark Streaming, partitionnement des topics Kafka et partitionnement des tables Delta Lake."
      },
      "isExample": true
    },
    {
      "id": "proj-3",
      "title": "Segmentation d’images médicales",
      "category": "vision-nlp",
      "categoryLabel": "Deep Learning & Vision",
      "academicYear": "4ème Année • Projet Vision par Ordinateur",
      "summary": "Segmentation et classification d'anomalies sur images IRM cérébrales à l'aide d'architectures CNN U-Net et Vision Transformers (ViT).",
      "github": "",
      "demo": "",
      "technologies": [
        "PyTorch",
        "OpenCV",
        "U-Net",
        "Torchvision",
        "Albumentations",
        "Weights & Biases"
      ],
      "fullDetails": {
        "problem": "Assister les radiologues dans la délimitation précise des contours tumoraux pour réduire le temps de diagnostic et la variabilité inter-praticiens.",
        "dataset": "BraTS (Brain Tumor Segmentation Challenge) : 1 251 examens IRM multi-modaux (T1, T1ce, T2, FLAIR).",
        "methodology": "Normalisation spatiale et d'intensité 3D, augmentation de données complexe, fonction de perte combinée Dice + Focal Loss pour contrer le déséquilibre de classes.",
        "architecture": "Prétraitement d'images DICOM/NIfTI → Modèle U-Net avec encodeur ResNet-34 pré-entraîné → Post-traitement morphologique OpenCV → Visualisation 3D.",
        "metrics": "Score Dice moyen de 0.88 sur l'ensemble de test. Spécificité de 97.4% et sensibilité de 89.2%.",
        "keyLearnings": "Maîtrise du traitement d'images médicales 3D, tuning des hyperparamètres sur GPU et suivi rigoureux avec Weights & Biases."
      },
      "isExample": true
    },
    {
      "id": "proj-4",
      "title": "Pipeline ETL avec Airflow & dbt",
      "category": "bigdata",
      "categoryLabel": "Big Data & Engineering",
      "academicYear": "4ème Année • Projet Data Management",
      "summary": "Pipeline de transformation moderne orchestré par Apache Airflow, modélisation en étoile (Star Schema) via dbt et stockage sous PostgreSQL / Snowflake.",
      "github": "",
      "demo": "",
      "technologies": [
        "Apache Airflow",
        "dbt Core",
        "PostgreSQL",
        "Snowflake",
        "Docker",
        "Great Expectations"
      ],
      "fullDetails": {
        "problem": "Consolider les données de ventes et de logistique d'une chaîne de distribution dispersées dans de multiples formats pour alimenter le décisionnel.",
        "dataset": "Données transactionnelles multi-sources totalisant plus de 2 millions d'enregistrements.",
        "methodology": "Implémentation d'un DAG Airflow idempotent, application de tests de qualité automatisés avec dbt test et Great Expectations.",
        "architecture": "Extraction multi-sources → Chargement staging PostgreSQL → Transformation déclarative SQL avec dbt → Tests d'intégrité → Exposition BI.",
        "metrics": "Temps d'exécution total de l'ETL divisé par 3 grâce aux matérialisations incrémentales de dbt. Taux de conformité des données de 100%.",
        "keyLearnings": "Gestion des DAGs Airflow complexes avec gestion des dépendances et alertes Slack, utilisation des macros Jinja dans dbt."
      },
      "isExample": true
    },
    {
      "id": "proj-5",
      "title": "Analyse de sentiments & résumé NLP",
      "category": "vision-nlp",
      "categoryLabel": "NLP & Transformers",
      "academicYear": "4ème Année • Projet Traitement du Langage",
      "summary": "Fine-tuning de modèles BERT et T5 pour l'analyse d'opinion et la synthèse automatique d'articles de presse et d'avis e-commerce.",
      "github": "",
      "demo": "",
      "technologies": [
        "Hugging Face",
        "PyTorch",
        "BERT",
        "T5",
        "Gradio",
        "Scikit-Learn"
      ],
      "fullDetails": {
        "problem": "Classer des milliers de retours utilisateurs dans 3 langues (Français, Anglais, Espagnol) et générer un résumé synthétique pour la direction produit.",
        "dataset": "Dataset Amazon Reviews multilingue (100k lignes) + CNN/DailyMail pour le résumé textuel.",
        "methodology": "Fine-tuning de bert-base-multilingual avec régularisation Dropout. Fine-tuning de t5-small avec LoRA (PEFT) pour limiter l'empreinte mémoire.",
        "architecture": "Tokenisation Hugging Face → Modèle BERT (Classification 5 classes) + Modèle T5 (Génération abstraite) → Déploiement d'une interface Gradio.",
        "metrics": "Accuracy de 89.4% sur la classification. Score ROUGE-1 de 41.2 et ROUGE-L de 38.6 sur les résumés générés.",
        "keyLearnings": "Compréhension fine des architectures d'attention (Self-Attention), tokenisation WordPiece, et techniques PEFT (Parameter-Efficient Fine-Tuning)."
      },
      "isExample": true
    },
    {
      "id": "proj-6",
      "title": "Recommandation à grande échelle",
      "category": "machinelearning",
      "categoryLabel": "Machine Learning Distribué",
      "academicYear": "5ème Année • Projet Calcul Massif",
      "summary": "Moteur de recommandation e-commerce combinant filtrage collaboratif (ALS) et filtrage basé sur le contenu sur cluster Spark.",
      "github": "",
      "demo": "",
      "technologies": [
        "Apache Spark",
        "PySpark MLlib",
        "Hadoop HDFS",
        "Cosine Similarity",
        "Python"
      ],
      "fullDetails": {
        "problem": "Recommander des produits pertinents aux utilisateurs en temps réel tout en résolvant le problème du démarrage à froid (Cold Start).",
        "dataset": "Dataset MovieLens 20M + Métadonnées de films (20 millions de notes, 138 000 utilisateurs).",
        "methodology": "Approche hybride : Factorisation de matrices (Alternating Least Squares - ALS) sous PySpark + Similarité Cosinus sur caractéristiques textuelles (TF-IDF).",
        "architecture": "Données cluster HDFS → Job PySpark d'extraction → Entraînement distribué ALS avec CrossValidator → Génération top-K exportées vers Redis.",
        "metrics": "RMSE final de 0.812 sur MovieLens 20M. Calcul des prédictions pour 100k utilisateurs en moins de 3 minutes sur cluster Spark 4 nœuds.",
        "keyLearnings": "Gestion de la mémoire et partitionnement des DataFrames Spark pour éviter l'erreur OutOfMemory (OOM), réglage des hyperparamètres de régularisation."
      },
      "isExample": true
    }
  ],
  "education": [
    {
      "degree": "Big Data & Intelligence Artificielle",
      "school": "Université Internationale de Rabat",
      "location": "Rabat, Maroc",
      "period": "5e année · En cours",
      "details": [
        "Recherche d’un stage de fin d’études en data engineering ou data analysis."
      ],
      "isExample": false
    }
  ],
  "certifications": []
};
var portfolioData = defaultPortfolioData;
