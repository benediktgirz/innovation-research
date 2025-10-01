export const layout = 'base.vto';

export default function* () {
  yield {
    url: '/404.html',
    title: 'Page Not Found - Benedikt Girz',
    description: 'The page you are looking for could not be found.',
    content: `
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p class="text-xl mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Popular Pages:</h2>
          <div class="space-y-2">
            <div><a href="/" class="link-style">Home</a></div>
            <div><a href="/about/" class="link-style">About</a></div>
            <div><a href="/experience/" class="link-style">Experience</a></div>
            <div><a href="/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Available in German:</h2>
          <div class="space-y-2">
            <div><a href="/de/" class="link-style">Startseite</a></div>
            <div><a href="/de/ueber-mich/" class="link-style">Über mich</a></div>
            <div><a href="/de/erfahrung/" class="link-style">Erfahrung</a></div>
            <div><a href="/de/kontakt/" class="link-style">Kontakt</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Available in French:</h2>
          <div class="space-y-2">
            <div><a href="/fr/" class="link-style">Accueil</a></div>
            <div><a href="/fr/a-propos/" class="link-style">À propos</a></div>
            <div><a href="/fr/experience/" class="link-style">Expérience</a></div>
            <div><a href="/fr/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Available in Portuguese:</h2>
          <div class="space-y-2">
            <div><a href="/pt/" class="link-style">Início</a></div>
            <div><a href="/pt/sobre/" class="link-style">Sobre</a></div>
            <div><a href="/pt/experiencia/" class="link-style">Experiência</a></div>
            <div><a href="/pt/contato/" class="link-style">Contato</a></div>
          </div>
        </div>
        
        <p class="text-base">
          <a href="/" class="contact-action-btn">Go Home</a>
        </p>
      </div>
    `,
  }; // note the semicolon here
  
  // German 404 page
  yield {
    url: '/de/404.html',
    title: 'Seite nicht gefunden - Benedikt Girz',
    description: 'Die gesuchte Seite konnte nicht gefunden werden.',
    lang: 'de',
    content: `
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1>
        <p class="text-xl mb-8">Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.</p>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Beliebte Seiten:</h2>
          <div class="space-y-2">
            <div><a href="/de/" class="link-style">Startseite</a></div>
            <div><a href="/de/ueber-mich/" class="link-style">Über mich</a></div>
            <div><a href="/de/erfahrung/" class="link-style">Erfahrung</a></div>
            <div><a href="/de/kontakt/" class="link-style">Kontakt</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Auch auf Englisch verfügbar:</h2>
          <div class="space-y-2">
            <div><a href="/" class="link-style">Home</a></div>
            <div><a href="/about/" class="link-style">About</a></div>
            <div><a href="/experience/" class="link-style">Experience</a></div>
            <div><a href="/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Auch auf Französisch verfügbar:</h2>
          <div class="space-y-2">
            <div><a href="/fr/" class="link-style">Accueil</a></div>
            <div><a href="/fr/a-propos/" class="link-style">À propos</a></div>
            <div><a href="/fr/experience/" class="link-style">Expérience</a></div>
            <div><a href="/fr/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <p class="text-base">
          <a href="/de/" class="contact-action-btn">Zur Startseite</a>
        </p>
      </div>
    `,
  };
  
  // French 404 page
  yield {
    url: '/fr/404.html',
    title: 'Page non trouvée - Benedikt Girz',
    description: 'La page que vous recherchez n\'a pas pu être trouvée.',
    lang: 'fr',
    content: `
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
        <p class="text-xl mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Pages populaires :</h2>
          <div class="space-y-2">
            <div><a href="/fr/" class="link-style">Accueil</a></div>
            <div><a href="/fr/a-propos/" class="link-style">À propos</a></div>
            <div><a href="/fr/experience/" class="link-style">Expérience</a></div>
            <div><a href="/fr/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Également disponible en anglais :</h2>
          <div class="space-y-2">
            <div><a href="/" class="link-style">Home</a></div>
            <div><a href="/about/" class="link-style">About</a></div>
            <div><a href="/experience/" class="link-style">Experience</a></div>
            <div><a href="/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Également disponible en allemand :</h2>
          <div class="space-y-2">
            <div><a href="/de/" class="link-style">Startseite</a></div>
            <div><a href="/de/ueber-mich/" class="link-style">Über mich</a></div>
            <div><a href="/de/erfahrung/" class="link-style">Erfahrung</a></div>
            <div><a href="/de/kontakt/" class="link-style">Kontakt</a></div>
          </div>
        </div>
        
        <p class="text-base">
          <a href="/fr/" class="contact-action-btn">Accueil</a>
        </p>
      </div>
    `,
  };
  
  // Portuguese 404 page
  yield {
    url: '/pt/404.html',
    title: 'Página não encontrada - Benedikt Girz',
    description: 'A página que você está procurando não pôde ser encontrada.',
    lang: 'pt',
    content: `
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
        <p class="text-xl mb-8">Desculpe, a página que você está procurando não existe ou foi movida.</p>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Páginas populares:</h2>
          <div class="space-y-2">
            <div><a href="/pt/" class="link-style">Início</a></div>
            <div><a href="/pt/sobre/" class="link-style">Sobre</a></div>
            <div><a href="/pt/experiencia/" class="link-style">Experiência</a></div>
            <div><a href="/pt/contato/" class="link-style">Contato</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Também disponível em inglês:</h2>
          <div class="space-y-2">
            <div><a href="/" class="link-style">Home</a></div>
            <div><a href="/about/" class="link-style">About</a></div>
            <div><a href="/experience/" class="link-style">Experience</a></div>
            <div><a href="/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Também disponível em alemão:</h2>
          <div class="space-y-2">
            <div><a href="/de/" class="link-style">Startseite</a></div>
            <div><a href="/de/ueber-mich/" class="link-style">Über mich</a></div>
            <div><a href="/de/erfahrung/" class="link-style">Erfahrung</a></div>
            <div><a href="/de/kontakt/" class="link-style">Kontakt</a></div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Também disponível em francês:</h2>
          <div class="space-y-2">
            <div><a href="/fr/" class="link-style">Accueil</a></div>
            <div><a href="/fr/a-propos/" class="link-style">À propos</a></div>
            <div><a href="/fr/experience/" class="link-style">Expérience</a></div>
            <div><a href="/fr/contact/" class="link-style">Contact</a></div>
          </div>
        </div>
        
        <p class="text-base">
          <a href="/pt/" class="contact-action-btn">Voltar ao início</a>
        </p>
      </div>
    `,
  };
  
}
