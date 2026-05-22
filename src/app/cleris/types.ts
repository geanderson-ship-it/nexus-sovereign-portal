export interface ClerisProduct {
  id: string;
  name: string;
  price: number;
  installments: number; // e.g. 10 for "10x sem juros"
  category: 'feminino' | 'masculino' | 'infantil' | 'esportes';
  images: string[]; // Up to 4 image paths/URLs (Lado, Frente, Cima, Calçado)
  description: string;
  sizes: number[];
  featured?: boolean;
}

export const INITIAL_PRODUCTS: ClerisProduct[] = [
  {
    id: 'p1',
    name: 'Scarpin Couro Nobre Cleris',
    price: 349.90,
    installments: 10,
    category: 'feminino',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596702994230-a885f5e6716a?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581101767113-1677fc2ebac8?w=600&auto=format&fit=crop'
    ],
    description: 'Scarpin clássico em couro legítimo. Salto fino elegante de 8cm e interior acolchoado para o máximo conforto em festas e trabalho.',
    sizes: [34, 35, 36, 37, 38, 39],
    featured: true
  },
  {
    id: 'p2',
    name: 'Sapato Social Oxford Derby',
    price: 299.90,
    installments: 10,
    category: 'masculino',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481868764331-d8da7d3f47de?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515442261605-65987783362a?w=600&auto=format&fit=crop'
    ],
    description: 'Sapato clássico Oxford confeccionado em couro legítimo premium com acabamento manual. Solado em borracha antiderrapante costurado.',
    sizes: [38, 39, 40, 41, 42, 43],
    featured: true
  },
  {
    id: 'p3',
    name: 'Tênis Running Ultralight Pro',
    price: 199.90,
    installments: 5,
    category: 'esportes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop'
    ],
    description: 'Tênis esportivo com amortecimento de alta performance e cabedal respirável em mesh. Perfeito para corridas, caminhadas e treinos diários.',
    sizes: [37, 38, 39, 40, 41, 42, 43],
    featured: true
  },
  {
    id: 'p4',
    name: 'Tênis Infantil Confort Kids',
    price: 139.90,
    installments: 4,
    category: 'infantil',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop'
    ],
    description: 'Tênis infantil flexível com fechamento em velcro facilitado. Confeccionado em material macio e solado anatômico emborrachado.',
    sizes: [22, 23, 24, 25, 26, 27, 28],
    featured: false
  },
  {
    id: 'p5',
    name: 'Sandália Anabela Ráfia Couro',
    price: 189.90,
    installments: 6,
    category: 'feminino',
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop'
    ],
    description: 'Sandália feminina Anabela com salto revestido em ráfia trançada natural. Tiras de couro macio e fivela reguladora no tornozelo.',
    sizes: [34, 35, 36, 37, 38, 39],
    featured: false
  },
  {
    id: 'p6',
    name: 'Sapatênis Casual Urban Cleris',
    price: 229.90,
    installments: 8,
    category: 'masculino',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop'
    ],
    description: 'Sapatênis masculino premium, perfeito para um estilo esporte fino versátil. Cabedal resistente e interior macio em microfibra.',
    sizes: [39, 40, 41, 42, 43, 44],
    featured: false
  }
];

export function getWhatsAppMessage(cart: { product: ClerisProduct; size: number; quantity: number }[]): string {
  let message = `Olá Cleris Calçados! Gostaria de fazer o pedido dos seguintes produtos do site piloto:\n\n`;
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.product.price * item.quantity;
    total += subtotal;
    message += `${index + 1}. *${item.product.name}*\n   - Tamanho: ${item.size}\n   - Qtd: ${item.quantity}\n   - Preço Unitário: R$ ${item.product.price.toFixed(2)}\n   - Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });
  message += `*Total do Pedido: R$ ${total.toFixed(2)}*\n\n`;
  message += `Gostaria de combinar a entrega em Venâncio Aires e a forma de pagamento (Pix / Cartão). Obrigado!`;
  return encodeURIComponent(message);
}
