/**
 * Europa Überlebens-Fibel - Search
 */

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput) return;

    // Search content index (will be populated with actual content)
    const searchIndex = buildSearchIndex();

    // Search on enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value, searchIndex);
        }
    });

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value, searchIndex);
        });
    }

    // Live search (with debounce)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.length >= 3) {
                showSearchSuggestions(searchInput.value, searchIndex);
            } else {
                hideSearchSuggestions();
            }
        }, 300);
    });
}

// Build search index from page content
function buildSearchIndex() {
    const index = [];

    // Index chapter cards
    document.querySelectorAll('.chapter-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const href = card.getAttribute('href') || '';

        index.push({
            type: 'chapter',
            title,
            content: `${title} ${desc}`,
            href,
            element: card
        });
    });

    // Index quick tips
    document.querySelectorAll('.tip-card').forEach(tip => {
        const title = tip.querySelector('h3')?.textContent || '';
        const desc = tip.querySelector('p')?.textContent || '';

        index.push({
            type: 'tip',
            title,
            content: `${title} ${desc}`,
            href: '#quick-tips',
            element: tip
        });
    });

    return index;
}

// Perform search
function performSearch(query, index) {
    if (!query.trim()) return;

    const results = searchInIndex(query, index);

    if (results.length > 0) {
        // Scroll to first result
        const firstResult = results[0];
        if (firstResult.element) {
            firstResult.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightElement(firstResult.element);
        }
    } else {
        // Show no results message
        showNoResultsMessage(query);
    }
}

// Search in index
function searchInIndex(query, index) {
    const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 1);

    return index.filter(item => {
        const content = item.content.toLowerCase();
        return searchTerms.some(term => content.includes(term));
    }).sort((a, b) => {
        // Sort by relevance (number of matching terms)
        const aMatches = searchTerms.filter(t => a.content.toLowerCase().includes(t)).length;
        const bMatches = searchTerms.filter(t => b.content.toLowerCase().includes(t)).length;
        return bMatches - aMatches;
    });
}

// Highlight search result
function highlightElement(element) {
    element.classList.add('search-highlight');
    element.style.animation = 'highlight-pulse 1s ease-in-out';

    setTimeout(() => {
        element.classList.remove('search-highlight');
        element.style.animation = '';
    }, 2000);
}

// Show search suggestions
function showSearchSuggestions(query, index) {
    const results = searchInIndex(query, index).slice(0, 5);

    // Remove existing suggestions
    hideSearchSuggestions();

    if (results.length === 0) return;

    const searchInput = document.getElementById('search-input');
    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    suggestions.id = 'search-suggestions';

    results.forEach(result => {
        const item = document.createElement('a');
        item.className = 'search-suggestion-item';
        item.href = result.href || '#';
        item.innerHTML = `
            <span class="suggestion-type">${result.type}</span>
            <span class="suggestion-title">${result.title}</span>
        `;
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (result.element) {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightElement(result.element);
            }
            hideSearchSuggestions();
            searchInput.value = '';
        });
        suggestions.appendChild(item);
    });

    searchInput.parentElement.appendChild(suggestions);
}

// Hide search suggestions
function hideSearchSuggestions() {
    const existing = document.getElementById('search-suggestions');
    if (existing) {
        existing.remove();
    }
}

// Show no results message
function showNoResultsMessage(query) {
    const lang = window.i18n?.getCurrentLanguage() || 'de';
    const messages = {
        de: `Keine Ergebnisse für "${query}" gefunden.`,
        en: `No results found for "${query}".`,
        fr: `Aucun résultat trouvé pour "${query}".`,
        es: `No se encontraron resultados para "${query}".`,
        uk: `Результатів для "${query}" не знайдено.`
    };

    alert(messages[lang] || messages.de);
}

// Add search styles dynamically
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-highlight {
        outline: 3px solid var(--color-accent);
        outline-offset: 5px;
    }
    
    @keyframes highlight-pulse {
        0%, 100% { outline-color: var(--color-accent); }
        50% { outline-color: var(--color-primary); }
    }
    
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 100;
        margin-top: 4px;
        overflow: hidden;
    }
    
    .search-suggestion-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        color: var(--text-primary);
        text-decoration: none;
        border-bottom: 1px solid var(--bg-tertiary);
        transition: background 0.15s ease;
    }
    
    .search-suggestion-item:last-child {
        border-bottom: none;
    }
    
    .search-suggestion-item:hover {
        background: var(--bg-secondary);
    }
    
    .suggestion-type {
        font-size: 0.7rem;
        text-transform: uppercase;
        background: var(--color-primary);
        color: white;
        padding: 0.15rem 0.4rem;
        border-radius: 3px;
    }
    
    .suggestion-title {
        font-weight: 500;
    }
    
    .nav-search {
        position: relative;
    }
`;
document.head.appendChild(searchStyles);
