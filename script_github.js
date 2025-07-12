class PortfolioManager {
    constructor() {
        this.portfolioImages = [];
        this.portfolioGrid = document.getElementById("portfolioGrid");
        this.filterBtns = document.querySelectorAll(".filter-btn");
        this.modal = null;
        this.apiBaseUrl = 'https://climatic-api-h2qn.onrender.com';
        this.init();
    }

    async init() {
        await this.loadImagesFromAPI();
        this.setupEventListeners();
        this.displayPortfolioItems();
    }

    async loadImagesFromAPI() {
        try {
            console.log("Carregando imagens da API...");
            const response = await fetch(`${this.apiBaseUrl}/api/portfolio-images`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Dados recebidos da API:", data);
            
            this.portfolioImages = [];
            
            // Processar dinamicamente todas as categorias retornadas pela API
            Object.entries(data).forEach(([category, images]) => {
                if (Array.isArray(images)) {
                    images.forEach(image => {
                        this.portfolioImages.push({
                            src: `${this.apiBaseUrl}/${image.src}`,
                            category: category,
                            alt: image.alt,
                            filename: image.filename
                        });
                    });
                }
            });
            
            console.log("Total de imagens carregadas:", this.portfolioImages.length);
            console.log("Imagens processadas:", this.portfolioImages);
            
        } catch (error) {
            console.error("Erro ao carregar imagens da API:", error);
            this.showErrorMessage();
        }
    }

    showErrorMessage() {
        if (this.portfolioGrid) {
            this.portfolioGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #e74c3c;"></i>
                    <h3>Erro ao carregar galeria</h3>
                    <p>Não foi possível conectar com o servidor de imagens.</p>
                    <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-dark); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    displayPortfolioItems(category = "all") {
        if (!this.portfolioGrid) {
            console.error("portfolioGrid element not found!");
            return;
        }

        this.portfolioGrid.innerHTML = "";

        // Se não há imagens carregadas, mostrar mensagem de carregamento
        if (this.portfolioImages.length === 0) {
            this.portfolioGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-dark);"></i>
                    <h3>Carregando galeria...</h3>
                    <p>Aguarde enquanto carregamos as imagens.</p>
                </div>
            `;
            return;
        }

        const filteredImages = category === "all"
            ? this.portfolioImages
            : this.portfolioImages.filter(img => img.category === category);

        console.log(`Exibindo ${filteredImages.length} imagens para categoria: ${category}`);

        if (filteredImages.length === 0) {
            this.portfolioGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhuma imagem encontrada para esta categoria.</p>
                </div>
            `;
            return;
        }

        filteredImages.forEach((image, index) => {
            const portfolioItem = document.createElement("div");
            portfolioItem.className = "portfolio-item fade-in";
            portfolioItem.innerHTML = `
                <img src="${image.src}" 
                     alt="${image.alt}" 
                     title="${image.filename}"
                     loading="lazy" 
                     onerror="console.error('Erro ao carregar:', '${image.filename}'); this.parentElement.style.display='none';"
                     onload="console.log('Carregada:', '${image.filename}');">
                <div class="portfolio-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;

            portfolioItem.addEventListener("click", () => this.openModal(image.src, image.alt));

            this.portfolioGrid.appendChild(portfolioItem);

            setTimeout(() => {
                portfolioItem.classList.add("visible");
            }, index * 100);
        });
    }

    setupEventListeners() {
        if (!this.filterBtns || this.filterBtns.length === 0) {
            console.error("Filter buttons not found!");
            return;
        }

        this.filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove active de todos os botões
                this.filterBtns.forEach(b => b.classList.remove("active"));
                // Adiciona active no botão clicado
                btn.classList.add("active");

                const category = btn.getAttribute("data-filter");
                console.log(`Filtro selecionado: ${category}`);
                this.displayPortfolioItems(category);
            });
        });
    }

    createModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="" alt="">
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector(".close");
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });

        return modal;
    }

    openModal(src, alt) {
        if (!this.modal) {
            this.modal = this.createModal();
        }

        const modalImg = this.modal.querySelector("img");
        modalImg.src = src;
        modalImg.alt = alt;
        this.modal.style.display = "block";
    }

    // Método para recarregar as imagens (útil para atualizações em tempo real)
    async refresh() {
        console.log("Atualizando galeria...");
        await this.loadImagesFromAPI();
        this.displayPortfolioItems();
    }
}

// DOM Elements
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.getElementById("contactForm");

// Mobile Navigation
hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// Contact Form Handler
contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const vehicleModel = formData.get("vehicleModel");
    const service = formData.get("service");
    const message = formData.get("message");

    let whatsappMessage = `🚗 *SOLICITAÇÃO DE ORÇAMENTO - CLIMATICCAR* 🚗\n\n`;
    whatsappMessage += `Olá ClimaticCar! Gostaria de solicitar um orçamento para seus serviços.\n\n`;
    whatsappMessage += `*Nome:* ${name}\n`;
    whatsappMessage += `*Telefone:* ${phone}\n`;
    whatsappMessage += `*Modelo do Veículo:* ${vehicleModel}\n`;
    whatsappMessage += `*Serviço Desejado:* ${service}\n`;
    if (message) {
        whatsappMessage += `*Observações:* ${message}\n`;
    }
    whatsappMessage += `\nQuando podemos agendar uma avaliação?`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/5517991783454?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

    this.reset();
});

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll(".fade-in");

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add("visible");
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector(".header");
    if (window.scrollY > 100) {
        header.style.background = "rgba(252, 252, 252, 0.98)";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
        header.style.background = "rgba(252, 252, 252, 0.95)";
        header.style.boxShadow = "none";
    }
}

// Event Listeners
window.addEventListener("scroll", () => {
    handleScrollAnimations();
    handleHeaderScroll();
});

window.addEventListener("load", () => {
    handleScrollAnimations();
});

// Initialize portfolio on page load
let portfolioManager;
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, inicializando PortfolioManager...");
    
    portfolioManager = new PortfolioManager();

    const elementsToAnimate = document.querySelectorAll(".hero-content, .hero-image, .about-text, .about-image, .service-card, .contact-item, .contact-form");
    elementsToAnimate.forEach(element => {
        element.classList.add("fade-in");
    });

    setTimeout(handleScrollAnimations, 100);
});

// Função global para recarregar galeria (útil para debug ou atualizações)
function refreshPortfolio() {
    if (portfolioManager) {
        portfolioManager.refresh();
    }
}

// Keyboard navigation for accessibility
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal = document.querySelector(".modal");
        if (modal && modal.style.display === "block") {
            modal.style.display = "none";
        }
    }
});

// Performance optimization: Lazy loading for images
if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    setTimeout(() => {
        document.querySelectorAll("img[data-src]").forEach(img => {
            imageObserver.observe(img);
        });
    }, 1000);
}
