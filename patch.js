const fs = require('fs');
const files = [
  'src/app/gabinete-vendas/agenda/page.tsx',
  'src/app/gabinete-vendas/egide/page.tsx',
  'src/app/gabinete-vendas/leads/page.tsx',
  'src/app/gabinete-vendas/prospector/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/const \{ user, isUserLoading \} = useUser\(\);[\s\S]*?if \(isUserLoading \|\| !isAuthorized\) \{/m, 
`const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
    if (!isVendasAuth) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {`);

  content = content.replace(/href="\/gabinete"/g, 'href="/gabinete-vendas"');
  fs.writeFileSync(f, content);
});
console.log('done');
