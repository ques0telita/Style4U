const navbar = document.querySelector('#navbar');

const createNavHome = () => {
    navbar.innerHTML = `
        <h1 class="text-black text-3xl font-bold">Style4U</h1>
        <input class="bg-gray-400 rounded-full d-full px-4 py-1 w-1/3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        placeholder="Search"
        type="text"
        >
        
        <div class="flex items-center space-x-6 text-white">
  
            <a href="/"><button class="flex items-center bg-black rounded gap-4 hover:text-indigo-200 transition-colors cursor-pointer focus:outline-none">
                <div class="relative">
                <svg 
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-0 2.033-.807 2.22-1.916l1.208-7.25H6.516M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span class="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-xs font-extrabold rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </div>
                <span class="font-semibold text-base p-2">Carrito</span>
            </button>
            </a>

            <a href="/login"><button class="flex items-center bg-black rounded gap-4 hover:text-indigo-200 transition-colors cursor-pointer focus:outline-none">
                <svg 
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span class="font-semibold text-base p-2">Perfil</span>
            </button>
            </a>
        </div>
    `;
};

createNavHome();