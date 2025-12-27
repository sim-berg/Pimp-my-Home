// Internationalization configuration
// German is the primary language

export type Locale = 'de' | 'en'

export const defaultLocale: Locale = 'de'

export const translations = {
  de: {
    // Navigation
    nav: {
      home: 'Startseite',
      shop: 'Shop',
      crystals: 'Kristalle',
      lamps: 'Lampen',
      live: 'Live Stream',
      cart: 'Warenkorb',
      search: 'Suchen',
    },

    // Hero Section
    hero: {
      badge: 'Handgefertigte 3D-Druck Schätze',
      title1: 'Verwandle Deinen Raum',
      title2: 'In Eine Kristallhöhle',
      description: 'Entdecke unsere Kollektion mystischer 3D-gedruckter Kristalle, Lampen und Dekoartikel. Jedes Stück wird mit Präzision und Leidenschaft gefertigt, um Magie in dein Zuhause zu bringen.',
      cta: 'Kollektion Entdecken',
      watchLive: 'Live Ansehen',
    },

    // Categories
    categories: {
      title: 'Kategorien Entdecken',
      subtitle: 'Finde das perfekte Stück für deinen Raum',
      crystals: 'Kristalle',
      lamps: 'Lampen',
      figurines: 'Figuren',
      homeDecor: 'Deko',
    },

    // Products
    products: {
      title: 'Unsere Kollektion',
      collection: 'Kollektion',
      featured: 'Ausgewählte Kristalle',
      viewAll: 'Alle Ansehen',
      viewAllProducts: 'Alle Produkte ansehen',
      quickView: 'Schnellansicht',
      addToCart: 'In den Warenkorb',
      adding: 'Wird hinzugefügt...',
      added: 'Hinzugefügt!',
      from: 'ab',
      variants: 'Varianten verfügbar',
      noProducts: 'Noch keine Produkte verfügbar',
      checkBack: 'Schau bald wieder vorbei!',
      showing: 'Zeige',
      features: 'Eigenschaften',
      feature1: 'Premium 3D-Druck Qualität',
      feature2: 'Umweltfreundliche Materialien',
      feature3: 'Mit Liebe handgefertigt',
      feature4: 'Weltweiter Versand',
    },

    // Cart
    cart: {
      title: 'Dein Warenkorb',
      empty: 'Dein Warenkorb ist leer',
      continueShopping: 'Weiter Einkaufen',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      tax: 'MwSt.',
      total: 'Gesamt',
      calculatedNext: 'Wird berechnet',
      checkout: 'Zur Kasse',
      shippingNote: 'Versand und Steuern werden an der Kasse berechnet',
    },

    // Checkout
    checkout: {
      title: 'Kasse',
      contact: 'Kontaktinformationen',
      email: 'E-Mail',
      phone: 'Telefon (optional)',
      shipping: 'Lieferadresse',
      firstName: 'Vorname',
      lastName: 'Nachname',
      address: 'Adresse',
      city: 'Stadt',
      postalCode: 'Postleitzahl',
      country: 'Land',
      payment: 'Zahlungsmethode',
      payWithPolar: 'Mit Polar bezahlen',
      securePayment: 'Sichere Zahlung via Polar',
      paypal: 'PayPal',
      comingSoon: 'Demnächst verfügbar (Phase 2)',
      completeOrder: 'Bestellung Abschließen',
      processing: 'Wird verarbeitet...',
      orderSummary: 'Bestellübersicht',
    },

    // Order Confirmation
    order: {
      confirmed: 'Bestellung Bestätigt!',
      orderId: 'Bestellnummer',
      thankYou: 'Vielen Dank für deinen Einkauf! Wir bereiten deine mystischen Kristalle mit Sorgfalt vor. Du erhältst in Kürze eine Bestätigungs-E-Mail.',
      crystalEnergy: 'Dein Kristall wird vor dem Versand mit positiver Energie aufgeladen!',
      continueShopping: 'Weiter Einkaufen',
      backHome: 'Zur Startseite',
    },

    // Live Stream
    live: {
      title: 'Live Kristall-Werkstatt',
      liveNow: 'JETZT LIVE',
      offline: 'Offline',
      description: 'Schau zu, wie unsere Kristalle live entstehen! Erhalte exklusive Rabatte und Einblicke hinter die Kulissen, wenn der Stream läuft.',
      streamSpecial: 'Stream Special!',
      useCode: 'Benutze Code',
      forDiscount: 'für 10% Rabatt',
      validWhileLive: 'Gültig während des Streams',
      schedule: 'Stream Zeitplan',
      monday: 'Montag',
      wednesday: 'Mittwoch',
      saturday: 'Samstag',
      followUs: 'Folge Uns',
      streamOffline: 'Stream Offline',
      offlineMessage: 'Wir sind gerade nicht live, aber schau bald wieder vorbei für mehr Kristall-Magie!',
      followOnTwitch: 'Auf Twitch Folgen',
      featuredToday: 'Heute Im Fokus',
    },

    // CTA Section
    cta: {
      badge: 'Handgefertigt mit Liebe',
      title: 'Transformiere Deinen Raum',
      description: 'Jedes Stück wird sorgfältig aus Premium-Materialien 3D-gedruckt und bringt mystische Energie und Schönheit in dein Zuhause.',
      shopNow: 'Jetzt Shoppen',
      learnMore: 'Mehr Erfahren',
    },

    // Trust Badges
    trustBadges: {
      freeShipping: 'Kostenloser Versand ab 50€',
      premiumQuality: 'Premium Qualität',
      returns: '30 Tage Rückgabe',
      support: '24/7 Support',
    },

    // Footer
    footer: {
      tagline: 'Handgefertigte 3D-gedruckte Kristalle und Dekoartikel, um deinen Raum in ein mystisches Heiligtum zu verwandeln.',
      shop: 'Shop',
      allProducts: 'Alle Produkte',
      company: 'Unternehmen',
      aboutUs: 'Über Uns',
      contact: 'Kontakt',
      faq: 'FAQ',
      legal: 'Rechtliches',
      privacy: 'Datenschutz',
      terms: 'AGB',
      shippingPolicy: 'Versand',
      returns: 'Rückgabe',
      copyright: 'Alle Rechte vorbehalten.',
      madeWith: 'Gefertigt mit Magie und 3D-Druck',
    },

    // Common
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      retry: 'Erneut versuchen',
      close: 'Schließen',
      language: 'Sprache',
    },
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      shop: 'Shop',
      crystals: 'Crystals',
      lamps: 'Lamps',
      live: 'Live Stream',
      cart: 'Cart',
      search: 'Search',
    },

    // Hero Section
    hero: {
      badge: 'Handcrafted 3D Printed Treasures',
      title1: 'Transform Your Space',
      title2: 'Into A Crystal Cave',
      description: 'Discover our collection of mystical 3D printed crystals, lamps, and decorative items. Each piece is crafted with precision and passion to bring magic into your home.',
      cta: 'Explore Collection',
      watchLive: 'Watch Live',
    },

    // Categories
    categories: {
      title: 'Explore Categories',
      subtitle: 'Find the perfect piece for your space',
      crystals: 'Crystals',
      lamps: 'Lamps',
      figurines: 'Figurines',
      homeDecor: 'Home Decor',
    },

    // Products
    products: {
      title: 'Our Collection',
      collection: 'Collection',
      featured: 'Featured Crystals',
      viewAll: 'View All',
      viewAllProducts: 'View All Products',
      quickView: 'Quick View',
      addToCart: 'Add to Cart',
      adding: 'Adding...',
      added: 'Added!',
      from: 'from',
      variants: 'variants available',
      noProducts: 'No products available yet',
      checkBack: 'Check back soon!',
      showing: 'Showing',
      features: 'Features',
      feature1: 'Premium 3D printed quality',
      feature2: 'Eco-friendly materials',
      feature3: 'Handcrafted with care',
      feature4: 'Worldwide shipping available',
    },

    // Cart
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      calculatedNext: 'Calculated next',
      checkout: 'Checkout',
      shippingNote: 'Shipping and taxes calculated at checkout',
    },

    // Checkout
    checkout: {
      title: 'Checkout',
      contact: 'Contact Information',
      email: 'Email',
      phone: 'Phone (optional)',
      shipping: 'Shipping Address',
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      payment: 'Payment Method',
      payWithPolar: 'Pay with Polar',
      securePayment: 'Secure payment via Polar',
      paypal: 'PayPal',
      comingSoon: 'Coming soon (Phase 2)',
      completeOrder: 'Complete Order',
      processing: 'Processing...',
      orderSummary: 'Order Summary',
    },

    // Order Confirmation
    order: {
      confirmed: 'Order Confirmed!',
      orderId: 'Order ID',
      thankYou: 'Thank you for your purchase! We\'re preparing your mystical crystals with care. You\'ll receive an email confirmation shortly.',
      crystalEnergy: 'Your crystal is being infused with positive energy before shipping!',
      continueShopping: 'Continue Shopping',
      backHome: 'Back to Home',
    },

    // Live Stream
    live: {
      title: 'Live Crystal Workshop',
      liveNow: 'LIVE NOW',
      offline: 'Offline',
      description: 'Watch our crystals being created live! Get exclusive discounts and behind-the-scenes access when the stream is on.',
      streamSpecial: 'Stream Special!',
      useCode: 'Use code',
      forDiscount: 'for 10% off',
      validWhileLive: 'Valid while stream is live',
      schedule: 'Stream Schedule',
      monday: 'Monday',
      wednesday: 'Wednesday',
      saturday: 'Saturday',
      followUs: 'Follow Us',
      streamOffline: 'Stream Offline',
      offlineMessage: 'We\'re not live right now, but check back soon for more crystal crafting magic!',
      followOnTwitch: 'Follow on Twitch',
      featuredToday: 'Featured Today',
    },

    // CTA Section
    cta: {
      badge: 'Handcrafted with Love',
      title: 'Transform Your Space',
      description: 'Each piece is meticulously 3D printed with premium materials, bringing mystical energy and beauty to your home.',
      shopNow: 'Shop Now',
      learnMore: 'Learn More',
    },

    // Trust Badges
    trustBadges: {
      freeShipping: 'Free Shipping over €50',
      premiumQuality: 'Premium Quality',
      returns: '30-Day Returns',
      support: '24/7 Support',
    },

    // Footer
    footer: {
      tagline: 'Handcrafted 3D printed crystals and decorative items to transform your space into a mystical sanctuary.',
      shop: 'Shop',
      allProducts: 'All Products',
      company: 'Company',
      aboutUs: 'About Us',
      contact: 'Contact',
      faq: 'FAQ',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      shippingPolicy: 'Shipping Policy',
      returns: 'Returns',
      copyright: 'All rights reserved.',
      madeWith: 'Made with magic and 3D printing',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
      language: 'Language',
    },
  },
} as const

export type TranslationKey = keyof typeof translations.de
