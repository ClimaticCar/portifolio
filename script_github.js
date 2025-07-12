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
            
            Object.entries(data).forEach(([category, images]) => {
                images.forEach(image => {
                    this.portfolioImages.push({
                        src: `${this.apiBaseUrl}/${image.src}`,
                        category: category,
                        alt: image.alt
                    });
                });
            });
            
            console.log("Total de imagens carregadas:", this.portfolioImages.length);
            
        } catch (error) {
            console.error("Erro ao carregar imagens da API:", error);
            this.loadFallbackImages();
        }
    }

    loadFallbackImages() {
        console.log("API indisponível. Usando imagens de fallback...");
        this.portfolioImages = [
            { src: 'images/815+MEXYk8L.jpg', category: 'small', alt: 'Instalação de ar condicionado em carro pequeno' },
            { src: 'images/D_NQ_NP_793907-MLB82239353897_022025-O-kit-refrigeraco-ferramentas-bomba-vacuo-manifold-flange.webp', category: '', alt: 'Kit refrigeração' },
            { src: 'images/D_Q_NP_679490-MLU71972907358_092023-O.webp', category: 'large', alt: 'Ferramentas de ar condicionado' },
            { src: 'images/153089642_101145618703466_8293561109177108869_n.jpg', category: 'small', alt: 'Serviço de ar condicionado' },
            { src: 'images/153382362_101145455370149_4521546796234082383_n.jpg', category: '', alt: 'Manutenção de ar condicionado' },
            { src: 'images/153536239_101145582036803_4644744414708856299_n.jpg', category: 'large', alt: 'Reparo de ar condicionado' },
            { src: 'images/153757448_101145565370138_5509669825380488893_n.jpg', category: 'small', alt: 'Limpeza de ar condicionado' },
            { src: 'images/154055730_101145392036822_6535271949818781599_n.jpg', category: '', alt: 'Troca de gás de ar condicionado' },
            { src: 'images/154371678_101145395370155_3305827279715775459_n.jpg', category: 'large', alt: 'Diagnóstico de ar condicionado' },
            { src: 'images/154575596_103642168453811_763963750754329685_n.jpg', category: 'small', alt: 'Ar condicionado automotivo' },
            { src: 'images/154695945_101145482036813_7480070034872470308_n.jpg', category: '', alt: 'Serviço de ar condicionado automotivo' },
            { src: 'images/469035885_971478115003541_1592953628638306103_n.jpg', category: 'large', alt: 'Manutenção de ar condicionado automotivo' },
            { src: 'images/469256964_971478138336872_6480118591484960727_n.jpg', category: 'small', alt: 'Reparo de ar condicionado automotivo' },
            { src: 'images/480408440_1026814242803261_4802262511460578313_n.jpg', category: '', alt: 'Limpeza de ar condicionado automotivo' },
            { src: 'images/480564866_1026095866208432_5419260286000376392_n.jpg', category: 'large', alt: 'Troca de gás de ar condicionado automotivo' }
        ];
        
        const portfolioSection = document.querySelector("#portfolio .section-subtitle");
        if (portfolioSection) {
            portfolioSection.innerHTML = "Alguns dos meus trabalhos<br><small style=\"color: #666; font-size: 0.8em;\">⚠️ Conectando com servidor de imagens...</small>";
        }
    }

    displayPortfolioItems(category = "all") {
        this.portfolioGrid.innerHTML = "";

        const filteredImages = category === "all"
            ? this.portfolioImages
            : this.portfolioImages.filter(img => img.category === category);

        console.log(`Exibindo ${filteredImages.length} imagens para categoria: ${category}`);

        const displayImages = filteredImages.slice(0, 12);

        if (displayImages.length === 0) {
            this.portfolioGrid.innerHTML = "<p>Nenhuma imagem encontrada para esta categoria.</p>";
            return;
        }

        displayImages.forEach((image, index) => {
            const portfolioItem = document.createElement("div");
            portfolioItem.className = "portfolio-item fade-in";
            portfolioItem.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy" onerror="this.style.display=\'none\'">
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
        this.filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                this.filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.getAttribute("data-filter");
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
document.addEventListener("DOMContentLoaded", () => {
    new PortfolioManager();

    const elementsToAnimate = document.querySelectorAll(".hero-content, .hero-image, .about-text, .about-image, .service-card, .contact-item, .contact-form");
    elementsToAnimate.forEach(element => {
        element.classList.add("fade-in");
    });

    setTimeout(handleScrollAnimations, 100);
});

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
