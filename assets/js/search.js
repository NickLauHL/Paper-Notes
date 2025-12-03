// 搜索功能
(function() {
  'use strict';
  
  // 等待 DOM 加载完成
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    let posts = [];
    
    // 获取所有文章数据
    fetch(window.searchDataUrl || '/search.json')
      .then(response => response.json())
      .then(data => {
        posts = data;
      })
      .catch(error => {
        console.error('加载搜索数据失败:', error);
      });
    
    // 搜索函数
    function search(query) {
      if (!query || query.length < 2) {
        searchResults.innerHTML = '<p class="no-results">请输入至少2个字符进行搜索</p>';
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = posts.filter(post => {
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
          (post.categories && post.categories.some(cat => cat.toLowerCase().includes(lowerQuery)))
        );
      });
      
      displayResults(results, query);
    }
    
    // 显示结果
    function displayResults(results, query) {
      if (results.length === 0) {
        searchResults.innerHTML = `<p class="no-results">未找到与 "${escapeHtml(query)}" 相关的内容</p>`;
        return;
      }
      
      let html = `<p class="search-result-count">找到 ${results.length} 条结果</p>`;
      html += '<ul class="post-list">';
      
      results.forEach(post => {
        const excerpt = highlightText(post.excerpt || post.content.substring(0, 150) + '...', query);
        const title = highlightText(post.title, query);
        
        html += `
          <li class="post-item">
            <a href="${post.url}" class="post-link">
              <h3 class="post-title">${title}</h3>
              <p class="post-excerpt">${excerpt}</p>
              <div class="post-meta">
                <span class="post-date">${post.date}</span>
                ${post.tags ? `<div class="post-tags">${post.tags.map(tag => `<span class="tag-item">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
              </div>
            </a>
          </li>
        `;
      });
      
      html += '</ul>';
      searchResults.innerHTML = html;
    }
    
    // 高亮匹配文本
    function highlightText(text, query) {
      if (!text) return '';
      const escaped = escapeHtml(text);
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return escaped.replace(regex, '<mark>$1</mark>');
    }
    
    // 转义 HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // 转义正则特殊字符
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 防抖函数
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
    
    // 监听输入
    searchInput.addEventListener('input', debounce(function(e) {
      search(e.target.value.trim());
    }, 300));
    
    // 如果 URL 有搜索参数，自动搜索
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      searchInput.value = queryParam;
      search(queryParam);
    }
  });
})();
