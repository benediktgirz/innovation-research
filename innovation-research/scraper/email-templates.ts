// Email templates for research invitations in 5 languages

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface TemplateData {
  clubName: string;
  league: string;
  recipientRole?: string;
}

// Helper to get league-specific language
export function getLeagueLanguage(league: string): string {
  const leagueLanguageMap: Record<string, string> = {
    'Premier League': 'en',
    'Bundesliga': 'de',
    'La Liga': 'es',
    'Serie A': 'it',
    'Ligue 1': 'fr',
  };
  return leagueLanguageMap[league] || 'en';
}

// Generate personalized email content
export function generateEmail(data: TemplateData, language: string): EmailTemplate {
  const templates: Record<string, (data: TemplateData) => EmailTemplate> = {
    en: generateEnglishEmail,
    de: generateGermanEmail,
    fr: generateFrenchEmail,
    es: generateSpanishEmail,
    it: generateItalianEmail,
  };

  const templateFn = templates[language] || templates.en;
  return templateFn(data);
}

// ENGLISH TEMPLATE
function generateEnglishEmail(data: TemplateData): EmailTemplate {
  const subject = `Innovation Research Invitation - ${data.clubName}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research Invitation</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Innovation in Professional Football</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">A Comprehensive Research Study</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Dear ${data.clubName} Team,</p>

    <p style="font-size: 16px;">I'm conducting the <strong>first comprehensive study on innovation in professional football</strong> across Europe's top five leagues, and I would be honored to include ${data.clubName}'s insights.</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #059669; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; color: #374151;"><strong>The Key Research Question:</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #1e3a8a; font-style: italic;">"What most recent innovation do you see making a difference on the pitch?"</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">By difference we mean winning more, by pitch we mean the team playing successful football.</p>
    </div>

    <p style="font-size: 16px;"><strong>Why this matters:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>First study covering all of ${data.league} and Europe's top 5 leagues</li>
      <li>Peer-reviewed research for academic publication</li>
      <li>Findings shared with all major football associations and media</li>
      <li>Contributors receive full study results free of charge</li>
    </ul>

    <p style="font-size: 16px;"><strong>Participation:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Takes only 2 minutes</li>
      <li>One strategic question to answer</li>
      <li>Full confidentiality guaranteed</li>
      <li>Results are anonymized and cumulative</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://research.benedikt-girz.com/?club=${encodeURIComponent(data.clubName)}" style="background: #1e3a8a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Participate Now</a>
    </div>

    <p style="font-size: 16px;"><strong>Timeline:</strong></p>
    <ul style="font-size: 15px; color: #374151;">
      <li><strong>October 2025:</strong> Data gathering</li>
      <li><strong>November 2025:</strong> Analysis & write-up</li>
      <li><strong>December 2025:</strong> Peer review</li>
      <li><strong>January 2026:</strong> Publication & distribution</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📊 Distribution Network:</strong> Results will be shared with Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA, and leading European football media outlets.
      </p>
    </div>

    <p style="font-size: 16px;">Your expertise would be invaluable to this research. I would be grateful if someone from the coaching staff or management could contribute your club's perspective.</p>

    <p style="font-size: 16px;">If you have any questions, please don't hesitate to reach out.</p>

    <p style="font-size: 16px; margin-top: 25px;">Best regards,</p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">Benedikt Girz</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Head Researcher</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Innovation in Professional Football Research</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://research.benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research.benedikt-girz.com</a> |
        <a href="mailto:research@benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research@benedikt-girz.com</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://www.linkedin.com/in/benedikt-girz/" style="color: #1e3a8a; text-decoration: none;">LinkedIn</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">© 2025 Innovation in Professional Football Research</p>
    <p style="margin: 5px 0 0 0;">This research study is conducted independently for academic and research purposes.</p>
  </div>
</body>
</html>
  `;

  const text = `
Innovation in Professional Football - Research Study

Dear ${data.clubName} Team,

I'm conducting the first comprehensive study on innovation in professional football across Europe's top five leagues, and I would be honored to include ${data.clubName}'s insights.

THE KEY RESEARCH QUESTION:
"What most recent innovation do you see making a difference on the pitch?"
(By difference we mean winning more, by pitch we mean the team playing successful football)

WHY THIS MATTERS:
- First study covering all of ${data.league} and Europe's top 5 leagues
- Peer-reviewed research for academic publication
- Findings shared with all major football associations and media
- Contributors receive full study results free of charge

PARTICIPATION:
- Takes only 2 minutes
- One strategic question to answer
- Full confidentiality guaranteed
- Results are anonymized and cumulative

PARTICIPATE: https://research.benedikt-girz.com/?club=${encodeURIComponent(data.clubName)}

TIMELINE:
- October 2025: Data gathering
- November 2025: Analysis & write-up
- December 2025: Peer review
- January 2026: Publication & distribution

Distribution: Results will be shared with Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA, and leading European football media outlets.

Your expertise would be invaluable to this research. I would be grateful if someone from the coaching staff or management could contribute your club's perspective.

If you have any questions, please don't hesitate to reach out.

Best regards,

Benedikt Girz
Head Researcher
Innovation in Professional Football Research
https://research.benedikt-girz.com
research@benedikt-girz.com
LinkedIn: https://www.linkedin.com/in/benedikt-girz/

---
© 2025 Innovation in Professional Football Research
This research study is conducted independently for academic and research purposes.
  `.trim();

  return { subject, html, text };
}

// GERMAN TEMPLATE
function generateGermanEmail(data: TemplateData): EmailTemplate {
  const subject = `Einladung zur Innovationsforschung - ${data.clubName}`;

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forschungseinladung</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Innovation im Profifußball</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Eine umfassende Forschungsstudie</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Sehr geehrtes ${data.clubName} Team,</p>

    <p style="font-size: 16px;">Ich führe die <strong>erste umfassende Studie über Innovation im Profifußball</strong> in den fünf europäischen Top-Ligen durch und würde mich sehr freuen, die Erkenntnisse von ${data.clubName} einzubeziehen.</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #059669; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; color: #374151;"><strong>Die zentrale Forschungsfrage:</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #1e3a8a; font-style: italic;">"Welche neueste Innovation macht Ihrer Meinung nach einen Unterschied auf dem Platz?"</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Mit Unterschied meinen wir mehr Siege, mit Platz meinen wir das Team, das erfolgreichen Fußball spielt.</p>
    </div>

    <p style="font-size: 16px;"><strong>Warum dies wichtig ist:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Erste Studie über die gesamte ${data.league} und Europas Top-5-Ligen</li>
      <li>Begutachtete Forschung für akademische Publikation</li>
      <li>Ergebnisse werden mit allen großen Fußballverbänden und Medien geteilt</li>
      <li>Teilnehmer erhalten kostenlos die vollständigen Studienergebnisse</li>
    </ul>

    <p style="font-size: 16px;"><strong>Teilnahme:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Dauert nur 2 Minuten</li>
      <li>Eine strategische Frage zu beantworten</li>
      <li>Vollständige Vertraulichkeit garantiert</li>
      <li>Ergebnisse sind anonymisiert und kumulativ</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://research.benedikt-girz.com/de/?club=${encodeURIComponent(data.clubName)}" style="background: #1e3a8a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Jetzt teilnehmen</a>
    </div>

    <p style="font-size: 16px;"><strong>Zeitplan:</strong></p>
    <ul style="font-size: 15px; color: #374151;">
      <li><strong>Oktober 2025:</strong> Datensammlung</li>
      <li><strong>November 2025:</strong> Analyse & Ausarbeitung</li>
      <li><strong>Dezember 2025:</strong> Peer-Review</li>
      <li><strong>Januar 2026:</strong> Veröffentlichung & Verbreitung</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📊 Verteilungsnetzwerk:</strong> Die Ergebnisse werden mit Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA und führenden europäischen Fußballmedien geteilt.
      </p>
    </div>

    <p style="font-size: 16px;">Ihre Expertise wäre für diese Forschung von unschätzbarem Wert. Ich wäre dankbar, wenn jemand aus dem Trainerstab oder der Geschäftsführung die Perspektive Ihres Vereins einbringen könnte.</p>

    <p style="font-size: 16px;">Bei Fragen können Sie sich gerne jederzeit an mich wenden.</p>

    <p style="font-size: 16px; margin-top: 25px;">Mit freundlichen Grüßen,</p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">Benedikt Girz</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Leitender Forscher</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Innovation im Profifußball Forschung</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://research.benedikt-girz.com/de" style="color: #1e3a8a; text-decoration: none;">research.benedikt-girz.com</a> |
        <a href="mailto:research@benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research@benedikt-girz.com</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://www.linkedin.com/in/benedikt-girz/" style="color: #1e3a8a; text-decoration: none;">LinkedIn</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">© 2025 Innovation im Profifußball Forschung</p>
    <p style="margin: 5px 0 0 0;">Diese Forschungsstudie wird unabhängig für akademische und Forschungszwecke durchgeführt.</p>
  </div>
</body>
</html>
  `;

  const text = `
Innovation im Profifußball - Forschungsstudie

Sehr geehrtes ${data.clubName} Team,

Ich führe die erste umfassende Studie über Innovation im Profifußball in den fünf europäischen Top-Ligen durch und würde mich sehr freuen, die Erkenntnisse von ${data.clubName} einzubeziehen.

DIE ZENTRALE FORSCHUNGSFRAGE:
"Welche neueste Innovation macht Ihrer Meinung nach einen Unterschied auf dem Platz?"
(Mit Unterschied meinen wir mehr Siege, mit Platz meinen wir das Team, das erfolgreichen Fußball spielt)

WARUM DIES WICHTIG IST:
- Erste Studie über die gesamte ${data.league} und Europas Top-5-Ligen
- Begutachtete Forschung für akademische Publikation
- Ergebnisse werden mit allen großen Fußballverbänden und Medien geteilt
- Teilnehmer erhalten kostenlos die vollständigen Studienergebnisse

TEILNAHME:
- Dauert nur 2 Minuten
- Eine strategische Frage zu beantworten
- Vollständige Vertraulichkeit garantiert
- Ergebnisse sind anonymisiert und kumulativ

TEILNEHMEN: https://research.benedikt-girz.com/de/?club=${encodeURIComponent(data.clubName)}

ZEITPLAN:
- Oktober 2025: Datensammlung
- November 2025: Analyse & Ausarbeitung
- Dezember 2025: Peer-Review
- Januar 2026: Veröffentlichung & Verbreitung

Verteilung: Die Ergebnisse werden mit Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA und führenden europäischen Fußballmedien geteilt.

Ihre Expertise wäre für diese Forschung von unschätzbarem Wert. Ich wäre dankbar, wenn jemand aus dem Trainerstab oder der Geschäftsführung die Perspektive Ihres Vereins einbringen könnte.

Bei Fragen können Sie sich gerne jederzeit an mich wenden.

Mit freundlichen Grüßen,

Benedikt Girz
Leitender Forscher
Innovation im Profifußball Forschung
https://research.benedikt-girz.com/de
research@benedikt-girz.com
LinkedIn: https://www.linkedin.com/in/benedikt-girz/

---
© 2025 Innovation im Profifußball Forschung
Diese Forschungsstudie wird unabhängig für akademische und Forschungszwecke durchgeführt.
  `.trim();

  return { subject, html, text };
}

// FRENCH TEMPLATE
function generateFrenchEmail(data: TemplateData): EmailTemplate {
  const subject = `Invitation à la recherche sur l'innovation - ${data.clubName}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation à la recherche</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Innovation dans le Football Professionnel</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Une étude de recherche complète</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Cher ${data.clubName},</p>

    <p style="font-size: 16px;">Je mène la <strong>première étude complète sur l'innovation dans le football professionnel</strong> dans les cinq meilleurs championnats européens, et je serais honoré d'inclure les perspectives de ${data.clubName}.</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #059669; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; color: #374151;"><strong>La question clé de recherche :</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #1e3a8a; font-style: italic;">"Quelle innovation récente voyez-vous faire la différence sur le terrain ?"</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Par différence, nous entendons gagner plus, par terrain nous entendons l'équipe jouant un football réussi.</p>
    </div>

    <p style="font-size: 16px;"><strong>Pourquoi c'est important :</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Première étude couvrant toute la ${data.league} et les 5 meilleurs championnats européens</li>
      <li>Recherche évaluée par des pairs pour publication académique</li>
      <li>Résultats partagés avec toutes les grandes associations de football et médias</li>
      <li>Les contributeurs reçoivent gratuitement les résultats complets de l'étude</li>
    </ul>

    <p style="font-size: 16px;"><strong>Participation :</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Prend seulement 2 minutes</li>
      <li>Une question stratégique à répondre</li>
      <li>Confidentialité totale garantie</li>
      <li>Résultats anonymisés et cumulatifs</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://research.benedikt-girz.com/fr/?club=${encodeURIComponent(data.clubName)}" style="background: #1e3a8a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Participer maintenant</a>
    </div>

    <p style="font-size: 16px;"><strong>Calendrier :</strong></p>
    <ul style="font-size: 15px; color: #374151;">
      <li><strong>Octobre 2025 :</strong> Collecte de données</li>
      <li><strong>Novembre 2025 :</strong> Analyse et rédaction</li>
      <li><strong>Décembre 2025 :</strong> Révision par les pairs</li>
      <li><strong>Janvier 2026 :</strong> Publication et distribution</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📊 Réseau de distribution :</strong> Les résultats seront partagés avec la Premier League, la Bundesliga, La Liga, la Serie A, la Ligue 1, la FIFA et les principaux médias sportifs européens.
      </p>
    </div>

    <p style="font-size: 16px;">Votre expertise serait inestimable pour cette recherche. Je serais reconnaissant si quelqu'un du staff technique ou de la direction pouvait contribuer avec la perspective de votre club.</p>

    <p style="font-size: 16px;">Si vous avez des questions, n'hésitez pas à me contacter.</p>

    <p style="font-size: 16px; margin-top: 25px;">Cordialement,</p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">Benedikt Girz</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Chercheur principal</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Recherche sur l'innovation dans le football professionnel</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://research.benedikt-girz.com/fr" style="color: #1e3a8a; text-decoration: none;">research.benedikt-girz.com</a> |
        <a href="mailto:research@benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research@benedikt-girz.com</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://www.linkedin.com/in/benedikt-girz/" style="color: #1e3a8a; text-decoration: none;">LinkedIn</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">© 2025 Recherche sur l'innovation dans le football professionnel</p>
    <p style="margin: 5px 0 0 0;">Cette étude de recherche est menée de manière indépendante à des fins académiques et de recherche.</p>
  </div>
</body>
</html>
  `;

  const text = `
Innovation dans le Football Professionnel - Étude de recherche

Cher ${data.clubName},

Je mène la première étude complète sur l'innovation dans le football professionnel dans les cinq meilleurs championnats européens, et je serais honoré d'inclure les perspectives de ${data.clubName}.

LA QUESTION CLÉ DE RECHERCHE :
"Quelle innovation récente voyez-vous faire la différence sur le terrain ?"
(Par différence, nous entendons gagner plus, par terrain nous entendons l'équipe jouant un football réussi)

POURQUOI C'EST IMPORTANT :
- Première étude couvrant toute la ${data.league} et les 5 meilleurs championnats européens
- Recherche évaluée par des pairs pour publication académique
- Résultats partagés avec toutes les grandes associations de football et médias
- Les contributeurs reçoivent gratuitement les résultats complets de l'étude

PARTICIPATION :
- Prend seulement 2 minutes
- Une question stratégique à répondre
- Confidentialité totale garantie
- Résultats anonymisés et cumulatifs

PARTICIPER : https://research.benedikt-girz.com/fr/?club=${encodeURIComponent(data.clubName)}

CALENDRIER :
- Octobre 2025 : Collecte de données
- Novembre 2025 : Analyse et rédaction
- Décembre 2025 : Révision par les pairs
- Janvier 2026 : Publication et distribution

Distribution : Les résultats seront partagés avec la Premier League, la Bundesliga, La Liga, la Serie A, la Ligue 1, la FIFA et les principaux médias sportifs européens.

Votre expertise serait inestimable pour cette recherche. Je serais reconnaissant si quelqu'un du staff technique ou de la direction pouvait contribuer avec la perspective de votre club.

Si vous avez des questions, n'hésitez pas à me contacter.

Cordialement,

Benedikt Girz
Chercheur principal
Recherche sur l'innovation dans le football professionnel
https://research.benedikt-girz.com/fr
research@benedikt-girz.com
LinkedIn: https://www.linkedin.com/in/benedikt-girz/

---
© 2025 Recherche sur l'innovation dans le football professionnel
Cette étude de recherche est menée de manière indépendante à des fins académiques et de recherche.
  `.trim();

  return { subject, html, text };
}

// SPANISH TEMPLATE
function generateSpanishEmail(data: TemplateData): EmailTemplate {
  const subject = `Invitación a investigación sobre innovación - ${data.clubName}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación a la investigación</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Innovación en el Fútbol Profesional</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Un estudio de investigación integral</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Estimado equipo del ${data.clubName},</p>

    <p style="font-size: 16px;">Estoy realizando el <strong>primer estudio integral sobre innovación en el fútbol profesional</strong> en las cinco ligas europeas de élite, y sería un honor incluir las perspectivas del ${data.clubName}.</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #059669; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; color: #374151;"><strong>La pregunta clave de investigación:</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #1e3a8a; font-style: italic;">"¿Qué innovación reciente ves que marca la diferencia en el campo?"</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Por diferencia nos referimos a ganar más, por campo nos referimos al equipo jugando fútbol exitoso.</p>
    </div>

    <p style="font-size: 16px;"><strong>Por qué esto importa:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Primer estudio que cubre toda ${data.league} y las 5 ligas principales de Europa</li>
      <li>Investigación revisada por pares para publicación académica</li>
      <li>Resultados compartidos con todas las grandes asociaciones de fútbol y medios</li>
      <li>Los contribuyentes reciben los resultados completos del estudio de forma gratuita</li>
    </ul>

    <p style="font-size: 16px;"><strong>Participación:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Solo toma 2 minutos</li>
      <li>Una pregunta estratégica para responder</li>
      <li>Confidencialidad total garantizada</li>
      <li>Resultados anonimizados y acumulativos</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://research.benedikt-girz.com/es/?club=${encodeURIComponent(data.clubName)}" style="background: #1e3a8a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Participar ahora</a>
    </div>

    <p style="font-size: 16px;"><strong>Cronograma:</strong></p>
    <ul style="font-size: 15px; color: #374151;">
      <li><strong>Octubre 2025:</strong> Recopilación de datos</li>
      <li><strong>Noviembre 2025:</strong> Análisis y redacción</li>
      <li><strong>Diciembre 2025:</strong> Revisión por pares</li>
      <li><strong>Enero 2026:</strong> Publicación y distribución</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📊 Red de distribución:</strong> Los resultados se compartirán con Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA y los principales medios deportivos europeos.
      </p>
    </div>

    <p style="font-size: 16px;">Su experiencia sería invaluable para esta investigación. Agradecería que alguien del cuerpo técnico o la dirección pudiera contribuir con la perspectiva de su club.</p>

    <p style="font-size: 16px;">Si tiene alguna pregunta, no dude en ponerse en contacto.</p>

    <p style="font-size: 16px; margin-top: 25px;">Saludos cordiales,</p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">Benedikt Girz</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Investigador principal</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Investigación sobre innovación en el fútbol profesional</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://research.benedikt-girz.com/es" style="color: #1e3a8a; text-decoration: none;">research.benedikt-girz.com</a> |
        <a href="mailto:research@benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research@benedikt-girz.com</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://www.linkedin.com/in/benedikt-girz/" style="color: #1e3a8a; text-decoration: none;">LinkedIn</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">© 2025 Investigación sobre innovación en el fútbol profesional</p>
    <p style="margin: 5px 0 0 0;">Este estudio de investigación se realiza de forma independiente con fines académicos y de investigación.</p>
  </div>
</body>
</html>
  `;

  const text = `
Innovación en el Fútbol Profesional - Estudio de investigación

Estimado equipo del ${data.clubName},

Estoy realizando el primer estudio integral sobre innovación en el fútbol profesional en las cinco ligas europeas de élite, y sería un honor incluir las perspectivas del ${data.clubName}.

LA PREGUNTA CLAVE DE INVESTIGACIÓN:
"¿Qué innovación reciente ves que marca la diferencia en el campo?"
(Por diferencia nos referimos a ganar más, por campo nos referimos al equipo jugando fútbol exitoso)

POR QUÉ ESTO IMPORTA:
- Primer estudio que cubre toda ${data.league} y las 5 ligas principales de Europa
- Investigación revisada por pares para publicación académica
- Resultados compartidos con todas las grandes asociaciones de fútbol y medios
- Los contribuyentes reciben los resultados completos del estudio de forma gratuita

PARTICIPACIÓN:
- Solo toma 2 minutos
- Una pregunta estratégica para responder
- Confidencialidad total garantizada
- Resultados anonimizados y acumulativos

PARTICIPAR: https://research.benedikt-girz.com/es/?club=${encodeURIComponent(data.clubName)}

CRONOGRAMA:
- Octubre 2025: Recopilación de datos
- Noviembre 2025: Análisis y redacción
- Diciembre 2025: Revisión por pares
- Enero 2026: Publicación y distribución

Distribución: Los resultados se compartirán con Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA y los principales medios deportivos europeos.

Su experiencia sería invaluable para esta investigación. Agradecería que alguien del cuerpo técnico o la dirección pudiera contribuir con la perspectiva de su club.

Si tiene alguna pregunta, no dude en ponerse en contacto.

Saludos cordiales,

Benedikt Girz
Investigador principal
Investigación sobre innovación en el fútbol profesional
https://research.benedikt-girz.com/es
research@benedikt-girz.com
LinkedIn: https://www.linkedin.com/in/benedikt-girz/

---
© 2025 Investigación sobre innovación en el fútbol profesional
Este estudio de investigación se realiza de forma independiente con fines académicos y de investigación.
  `.trim();

  return { subject, html, text };
}

// ITALIAN TEMPLATE
function generateItalianEmail(data: TemplateData): EmailTemplate {
  const subject = `Invito alla ricerca sull'innovazione - ${data.clubName}`;

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invito alla ricerca</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Innovazione nel Calcio Professionistico</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Uno studio di ricerca completo</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Gentile team del ${data.clubName},</p>

    <p style="font-size: 16px;">Sto conducendo il <strong>primo studio completo sull'innovazione nel calcio professionistico</strong> nelle cinque principali leghe europee, e sarei onorato di includere le prospettive del ${data.clubName}.</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #059669; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; color: #374151;"><strong>La domanda chiave della ricerca:</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #1e3a8a; font-style: italic;">"Quale innovazione recente vedi fare la differenza in campo?"</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Per differenza intendiamo vincere di più, per campo intendiamo la squadra che gioca un calcio di successo.</p>
    </div>

    <p style="font-size: 16px;"><strong>Perché è importante:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Primo studio che copre tutta la ${data.league} e le 5 principali leghe europee</li>
      <li>Ricerca peer-reviewed per pubblicazione accademica</li>
      <li>Risultati condivisi con tutte le principali associazioni calcistiche e media</li>
      <li>I contributori ricevono gratuitamente i risultati completi dello studio</li>
    </ul>

    <p style="font-size: 16px;"><strong>Partecipazione:</strong></p>
    <ul style="font-size: 16px; color: #374151;">
      <li>Richiede solo 2 minuti</li>
      <li>Una domanda strategica a cui rispondere</li>
      <li>Piena riservatezza garantita</li>
      <li>Risultati anonimizzati e cumulativi</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://research.benedikt-girz.com/it/?club=${encodeURIComponent(data.clubName)}" style="background: #1e3a8a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Partecipa ora</a>
    </div>

    <p style="font-size: 16px;"><strong>Cronologia:</strong></p>
    <ul style="font-size: 15px; color: #374151;">
      <li><strong>Ottobre 2025:</strong> Raccolta dati</li>
      <li><strong>Novembre 2025:</strong> Analisi e stesura</li>
      <li><strong>Dicembre 2025:</strong> Peer review</li>
      <li><strong>Gennaio 2026:</strong> Pubblicazione e distribuzione</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📊 Rete di distribuzione:</strong> I risultati saranno condivisi con Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA e i principali media sportivi europei.
      </p>
    </div>

    <p style="font-size: 16px;">La vostra esperienza sarebbe inestimabile per questa ricerca. Sarei grato se qualcuno dello staff tecnico o della direzione potesse contribuire con la prospettiva del vostro club.</p>

    <p style="font-size: 16px;">Per qualsiasi domanda, non esitate a contattarmi.</p>

    <p style="font-size: 16px; margin-top: 25px;">Cordiali saluti,</p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">Benedikt Girz</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Ricercatore principale</p>
      <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Ricerca sull'innovazione nel calcio professionistico</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://research.benedikt-girz.com/it" style="color: #1e3a8a; text-decoration: none;">research.benedikt-girz.com</a> |
        <a href="mailto:research@benedikt-girz.com" style="color: #1e3a8a; text-decoration: none;">research@benedikt-girz.com</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">
        <a href="https://www.linkedin.com/in/benedikt-girz/" style="color: #1e3a8a; text-decoration: none;">LinkedIn</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">© 2025 Ricerca sull'innovazione nel calcio professionistico</p>
    <p style="margin: 5px 0 0 0;">Questo studio di ricerca è condotto in modo indipendente per scopi accademici e di ricerca.</p>
  </div>
</body>
</html>
  `;

  const text = `
Innovazione nel Calcio Professionistico - Studio di ricerca

Gentile team del ${data.clubName},

Sto conducendo il primo studio completo sull'innovazione nel calcio professionistico nelle cinque principali leghe europee, e sarei onorato di includere le prospettive del ${data.clubName}.

LA DOMANDA CHIAVE DELLA RICERCA:
"Quale innovazione recente vedi fare la differenza in campo?"
(Per differenza intendiamo vincere di più, per campo intendiamo la squadra che gioca un calcio di successo)

PERCHÉ È IMPORTANTE:
- Primo studio che copre tutta la ${data.league} e le 5 principali leghe europee
- Ricerca peer-reviewed per pubblicazione accademica
- Risultati condivisi con tutte le principali associazioni calcistiche e media
- I contributori ricevono gratuitamente i risultati completi dello studio

PARTECIPAZIONE:
- Richiede solo 2 minuti
- Una domanda strategica a cui rispondere
- Piena riservatezza garantita
- Risultati anonimizzati e cumulativi

PARTECIPA: https://research.benedikt-girz.com/it/?club=${encodeURIComponent(data.clubName)}

CRONOLOGIA:
- Ottobre 2025: Raccolta dati
- Novembre 2025: Analisi e stesura
- Dicembre 2025: Peer review
- Gennaio 2026: Pubblicazione e distribuzione

Distribuzione: I risultati saranno condivisi con Premier League, Bundesliga, La Liga, Serie A, Ligue 1, FIFA e i principali media sportivi europei.

La vostra esperienza sarebbe inestimabile per questa ricerca. Sarei grato se qualcuno dello staff tecnico o della direzione potesse contribuire con la prospettiva del vostro club.

Per qualsiasi domanda, non esitate a contattarmi.

Cordiali saluti,

Benedikt Girz
Ricercatore principale
Ricerca sull'innovazione nel calcio professionistico
https://research.benedikt-girz.com/it
research@benedikt-girz.com
LinkedIn: https://www.linkedin.com/in/benedikt-girz/

---
© 2025 Ricerca sull'innovazione nel calcio professionistico
Questo studio di ricerca è condotto in modo indipendente per scopi accademici e di ricerca.
  `.trim();

  return { subject, html, text };
}
