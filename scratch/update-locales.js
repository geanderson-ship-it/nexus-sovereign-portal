const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'src', 'lib', 'locales');

const keys = {
  "pt-BR": {
    "inovamoda.slogan": "Em tempo real, revele todos os estilos que existem em você.",
    "inovamoda.descPremium": "A revolução do varejo digital de moda. Aumente as suas conversões e reduza a taxa de devoluções a zero com um provador virtual 3D interativo, dinâmico e de altíssimo padrão fotorealista.",
    "inovamoda.descSimulator": "A evolução definitiva do E-commerce de Moda. O Provador Virtual 3D alimentado por Inteligência Artificial Soberana. Reduza a logística reversa a quase zero.",
    "inovamoda.btnAcionar": "Acionar o InovaModa 360",
    "inovamoda.btnSimulator": "Acessar Simulador",
    "inovamoda.reductionTitle": "Redução de Devoluções",
    "inovamoda.reductionDesc": "Elimine a logística reversa. O provador virtual garante que a peça caiba perfeitamente no corpo do cliente antes do checkout.",
    "inovamoda.engagementTitle": "Engajamento Máximo",
    "inovamoda.engagementDesc": "Transforme a compra em uma experiência imersiva. Clientes passam até 3x mais tempo na sua loja testando combinações e looks.",
    "inovamoda.realismTitle": "Hiper-Realismo 3D",
    "inovamoda.realismDesc": "Renderização fotorealista de tecidos e caimentos. A Inteligência Artificial interpreta o volume da roupa no biotipo exato do cliente.",
    "inovamoda.backToPremium": "Voltar para Premium",
    "inovamoda.cardDesc": "Experimentação virtual com avatares dinâmicos de alto padrão. Eleve as conversões e reduza a taxa de devoluções a zero."
  },
  "en-US": {
    "inovamoda.slogan": "In real time, reveal all the styles that exist within you.",
    "inovamoda.descPremium": "The revolution of digital fashion retail. Increase your conversions and reduce return rates to zero with an interactive, dynamic, and highly photorealistic 3D virtual fitting room.",
    "inovamoda.descSimulator": "The definitive evolution of Fashion E-commerce. The 3D Virtual Fitting Room powered by Sovereign Artificial Intelligence. Reduce reverse logistics to near zero.",
    "inovamoda.btnAcionar": "Activate InovaModa 360",
    "inovamoda.btnSimulator": "Access Simulator",
    "inovamoda.reductionTitle": "Reduced Returns",
    "inovamoda.reductionDesc": "Eliminate reverse logistics. The virtual fitting room ensures the garment perfectly fits the customer's body before checkout.",
    "inovamoda.engagementTitle": "Maximum Engagement",
    "inovamoda.engagementDesc": "Transform shopping into an immersive experience. Customers spend up to 3x more time in your store testing combinations and looks.",
    "inovamoda.realismTitle": "3D Hyper-Realism",
    "inovamoda.realismDesc": "Photorealistic rendering of fabrics and drapes. The AI interprets the volume of the clothing on the customer's exact body type.",
    "inovamoda.backToPremium": "Back to Premium",
    "inovamoda.cardDesc": "Virtual try-on with high-end dynamic avatars. Elevate conversions and reduce return rates to zero."
  },
  "es-ES": {
    "inovamoda.slogan": "En tiempo real, revela todos los estilos que existen en ti.",
    "inovamoda.descPremium": "La revolución del comercio minorista de moda digital. Aumente sus conversiones y reduzca la tasa de devoluciones a cero con un probador virtual 3D interactivo, dinámico y de alto estándar fotorrealista.",
    "inovamoda.descSimulator": "La evolución definitiva del E-commerce de Moda. El Probador Virtual 3D impulsado por Inteligencia Artificial Soberana. Reduzca la logística inversa a casi cero.",
    "inovamoda.btnAcionar": "Activar InovaModa 360",
    "inovamoda.btnSimulator": "Acceder al Simulador",
    "inovamoda.reductionTitle": "Reducción de Devoluciones",
    "inovamoda.reductionDesc": "Elimine la logística inversa. El probador virtual garantiza que la prenda se ajuste perfectamente al cuerpo del cliente antes del pago.",
    "inovamoda.engagementTitle": "Compromiso Máximo",
    "inovamoda.engagementDesc": "Transforme la compra en una experiencia inmersiva. Los clientes pasan hasta 3 veces más tiempo en su tienda probando combinaciones y looks.",
    "inovamoda.realismTitle": "Hiperrealismo 3D",
    "inovamoda.realismDesc": "Representación fotorrealista de telas y caídas. La IA interpreta el volumen de la ropa en el biotipo exacto del cliente.",
    "inovamoda.backToPremium": "Volver a Premium",
    "inovamoda.cardDesc": "Prueba virtual con avatares dinámicos de alto nivel. Aumente las conversiones y reduzca la tasa de devoluciones a cero."
  },
  "de-DE": {
    "inovamoda.slogan": "Enthüllen Sie in Echtzeit alle Stile, die in Ihnen stecken.",
    "inovamoda.descPremium": "Die Revolution des digitalen Modeeinzelhandels. Steigern Sie Ihre Konversionen und reduzieren Sie Retouren auf null mit einer interaktiven, dynamischen und höchst fotorealistischen 3D-Virtual-Umkleidekabine.",
    "inovamoda.descSimulator": "Die definitive Evolution des Mode-E-Commerce. Die 3D-Virtual-Umkleidekabine, angetrieben von Sovereign Artificial Intelligence. Reduzieren Sie die Rückwärtslogistik auf fast null.",
    "inovamoda.btnAcionar": "InovaModa 360 aktivieren",
    "inovamoda.btnSimulator": "Simulator aufrufen",
    "inovamoda.reductionTitle": "Retourenreduzierung",
    "inovamoda.reductionDesc": "Eliminieren Sie die Rückwärtslogistik. Die virtuelle Umkleidekabine stellt sicher, dass das Kleidungsstück vor dem Bezahlen perfekt zum Körper des Kunden passt.",
    "inovamoda.engagementTitle": "Maximales Engagement",
    "inovamoda.engagementDesc": "Verwandeln Sie das Einkaufen in ein immersives Erlebnis. Kunden verbringen bis zu 3x mehr Zeit in Ihrem Geschäft, um Kombinationen und Looks zu testen.",
    "inovamoda.realismTitle": "3D-Hyperrealismus",
    "inovamoda.realismDesc": "Fotorealistisches Rendern von Stoffen und Faltenwürfen. Die KI interpretiert das Volumen der Kleidung am genauen Körpertyp des Kunden.",
    "inovamoda.backToPremium": "Zurück zu Premium",
    "inovamoda.cardDesc": "Virtuelle Anprobe mit dynamischen High-End-Avataren. Steigern Sie die Konversionen und reduzieren Sie die Retourenquote auf null."
  },
  "fr-FR": {
    "inovamoda.slogan": "En temps réel, révélez tous les styles qui existent en vous.",
    "inovamoda.descPremium": "La révolution du commerce de détail de mode numérique. Augmentez vos conversions et réduisez le taux de retours à zéro avec une cabine d'essayage virtuelle 3D interactive, dynamique et hautement photoréaliste.",
    "inovamoda.descSimulator": "L'évolution définitive du commerce électronique de mode. La cabine d'essayage virtuelle 3D alimentée par l'intelligence artificielle souveraine. Réduisez la logistique inverse à presque zéro.",
    "inovamoda.btnAcionar": "Activer InovaModa 360",
    "inovamoda.btnSimulator": "Accéder au Simulateur",
    "inovamoda.reductionTitle": "Réduction des Retours",
    "inovamoda.reductionDesc": "Éliminez la logistique inverse. La cabine d'essayage virtuelle garantit que le vêtement s'adapte parfaitement au corps du client avant le paiement.",
    "inovamoda.engagementTitle": "Engagement Maximal",
    "inovamoda.engagementDesc": "Transformez l'achat en une expérience immersive. Les clients passent jusqu'à 3x plus de temps dans votre boutique à tester des combinaisons et des looks.",
    "inovamoda.realismTitle": "Hyper-Réalisme 3D",
    "inovamoda.realismDesc": "Rendu photoréaliste des tissus et des drapés. L'IA interprète le volume du vêtement sur le biotype exact du client.",
    "inovamoda.backToPremium": "Retour à Premium",
    "inovamoda.cardDesc": "Essayage virtuel avec des avatars dynamiques haut de gamme. Augmentez les conversions et réduisez le taux de retours à zéro."
  },
  "ja-JP": {
    "inovamoda.slogan": "リアルタイムで、あなたの中に存在するすべてのスタイルを明らかにします。",
    "inovamoda.descPremium": "デジタルファッション小売りの革命。インタラクティブでダイナミック、そして非常に写実的な3D仮想試着室で、コンバージョンを増やし、返品率をゼロに減らします。",
    "inovamoda.descSimulator": "ファッションEコマースの決定的な進化。ソブリン人工知能を搭載した3D仮想試着室。リバースロジスティクスをほぼゼロに減らします。",
    "inovamoda.btnAcionar": "InovaModa 360をアクティブにする",
    "inovamoda.btnSimulator": "シミュレーターにアクセス",
    "inovamoda.reductionTitle": "返品の削減",
    "inovamoda.reductionDesc": "リバースロジスティクスを排除します。仮想試着室は、チェックアウト前に衣服が顧客の体に完全にフィットすることを保証します。",
    "inovamoda.engagementTitle": "最大のエエンゲージメント",
    "inovamoda.engagementDesc": "買い物を没入型の体験に変えます。顧客は、組み合わせやルックをテストするために、ストアで最大3倍の時間を費やします。",
    "inovamoda.realismTitle": "3Dハイパーリアリズム",
    "inovamoda.realismDesc": "生地とドレープの写実的なレンダリング。AIは、顧客の正確な体型上の衣服のボリュームを解釈します。",
    "inovamoda.backToPremium": "プレミアムに戻る",
    "inovamoda.cardDesc": "ハイエンドのダイナミックアバターを使用したバーチャル試着。コンバージョンを高め、返品率をゼロに減らします。"
  },
  "zh-CN": {
    "inovamoda.slogan": "实时展现您内在的所有风格。",
    "inovamoda.descPremium": "数字时尚零售的革命。通过交互式、动态和高度逼真的3D虚拟试衣间，提高您的转化率并将退货率降至零。",
    "inovamoda.descSimulator": "时尚电子商务的最终演进。由主权人工智能提供支持的3D虚拟试衣间。将逆向物流降至几乎为零。",
    "inovamoda.btnAcionar": "激活 InovaModa 360",
    "inovamoda.btnSimulator": "访问模拟器",
    "inovamoda.reductionTitle": "减少退货",
    "inovamoda.reductionDesc": "消除逆向物流。虚拟试衣间可确保服装在结账前完美贴合客户的身体。",
    "inovamoda.engagementTitle": "最大化参与度",
    "inovamoda.engagementDesc": "将购物转化为沉浸式体验。客户在您的商店中测试组合和外观的时间最多可增加 3 倍。",
    "inovamoda.realismTitle": "3D 超写实主义",
    "inovamoda.realismDesc": "面料和悬垂的逼真渲染。人工智能可根据客户的精确体型解释服装的体积。",
    "inovamoda.backToPremium": "返回 Premium",
    "inovamoda.cardDesc": "使用高端动态虚拟化身进行虚拟试穿。提高转化率并将退货率降至零。"
  },
  "ar-AE": {
    "inovamoda.slogan": "في الوقت الفعلي، اكشف عن جميع الأنماط الموجودة بداخلك.",
    "inovamoda.descPremium": "ثورة تجارة التجزئة الرقمية للأزياء. قم بزيادة تحويلاتك وتقليل معدل المرتجعات إلى الصفر من خلال غرفة قياس افتراضية ثلاثية الأبعاد تفاعلية وديناميكية وعالية الدقة والواقعية.",
    "inovamoda.descSimulator": "التطور النهائي للتجارة الإلكترونية للأزياء. غرفة القياس الافتراضية ثلاثية الأبعاد المدعومة بالذكاء الاصطناعي السيادي. تقليل اللوجستيات العكسية إلى ما يقرب من الصفر.",
    "inovamoda.btnAcionar": "تنشيط InovaModa 360",
    "inovamoda.btnSimulator": "الوصول إلى جهاز المحاكاة",
    "inovamoda.reductionTitle": "تقليل المرتجعات",
    "inovamoda.reductionDesc": "القضاء على اللوجستيات العكسية. تضمن غرفة القياس الافتراضية أن الثوب يناسب جسم العميل تمامًا قبل الدفع.",
    "inovamoda.engagementTitle": "أقصى قدر من المشاركة",
    "inovamoda.engagementDesc": "تحويل التسوق إلى تجربة غامرة. يقضي العملاء ما يصل إلى 3 أضعاف الوقت في متجرك في اختبار المجموعات والمظاهر.",
    "inovamoda.realismTitle": "الواقعية المفرطة ثلاثية الأبعاد",
    "inovamoda.realismDesc": "تقديم واقعي للأقمشة والستائر. يفسر الذكاء الاصطناعي حجم الملابس على النمط الحيوي الدقيق للعميل.",
    "inovamoda.backToPremium": "العودة إلى Premium",
    "inovamoda.cardDesc": "تجربة افتراضية باستخدام صور رمزية ديناميكية متطورة. رفع التحويلات وتقليل معدل المرتجعات إلى الصفر."
  },
  "ru-RU": {
    "inovamoda.slogan": "В режиме реального времени раскройте все стили, которые есть в вас.",
    "inovamoda.descPremium": "Революция в цифровой розничной торговле модной одеждой. Увеличьте количество конверсий и сведите к нулю процент возвратов с помощью интерактивной, динамичной и высокореалистичной виртуальной примерочной 3D.",
    "inovamoda.descSimulator": "Окончательная эволюция электронной коммерции моды. Виртуальная примерочная 3D на базе суверенного искусственного интеллекта. Сведите обратную логистику почти к нулю.",
    "inovamoda.btnAcionar": "Активировать InovaModa 360",
    "inovamoda.btnSimulator": "Доступ к симулятору",
    "inovamoda.reductionTitle": "Снижение возвратов",
    "inovamoda.reductionDesc": "Исключите обратную логистику. Виртуальная примерочная гарантирует, что одежда идеально сядет по фигуре клиента до оплаты.",
    "inovamoda.engagementTitle": "Максимальная вовлеченность",
    "inovamoda.engagementDesc": "Превратите покупки в захватывающий опыт. Клиенты проводят в вашем магазине до 3 раз больше времени, тестируя комбинации и образы.",
    "inovamoda.realismTitle": "3D-гиперреализм",
    "inovamoda.realismDesc": "Фотореалистичный рендеринг тканей и драпировок. ИИ интерпретирует объем одежды точно по типу фигуры клиента.",
    "inovamoda.backToPremium": "Назад к Premium",
    "inovamoda.cardDesc": "Виртуальная примерка с высококлассными динамическими аватарами. Повысьте конверсию и сведите уровень возвратов к нулю."
  }
};

const fileNames = fs.readdirSync(localesPath).filter(f => f.endsWith('.json'));

fileNames.forEach(file => {
  const filePath = path.join(localesPath, file);
  const localeKey = file.replace('.json', '');
  
  if (keys[localeKey]) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Merge new keys
      const newDict = { ...data, ...keys[localeKey] };
      
      fs.writeFileSync(filePath, JSON.stringify(newDict, null, 2), 'utf8');
      console.log(`Updated ${file}`);
    } catch (err) {
      console.error(`Error updating ${file}:`, err);
    }
  } else {
    console.warn(`No translations provided for ${localeKey}`);
  }
});

console.log("All locales updated successfully.");
