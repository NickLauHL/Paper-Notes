// 全文搜索功能
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    let posts = [];
    
    // 获取所有文章数据
    fetch(window.searchDataUrl || '/Paper-Notes/search.json')
      .then(response => response.json())
      .then(data => {
        posts = data;
        console.log('搜索数据已加载，共 ' + posts.length + ' 篇文章');
      })
      .catch(error => {
        console.error('加载搜索数据失败:', error);
      });
    
    // 搜索函数 - 搜索所有内容
    function search(query) {
      if (!query || query.length < 1) {
        searchResults.innerHTML = '<p class="no-results">请输入关键词开始搜索</p>';
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = [];
      
      posts.forEach(post => {
        let matches = [];
        
        // 搜索标题
        if (post.title && post.title.toLowerCase().includes(lowerQuery)) {
          matches.push({type: '标题', text: post.title});
        }
        
        // 搜索完整正文内容
        if (post.fullContent && post.fullContent.toLowerCase().includes(lowerQuery)) {
          // 找到匹配位置，提取上下文
          const content = post.fullContent;
          const lowerContent = content.toLowerCase();
          const index = lowerContent.indexOf(lowerQuery);
          
          if (index !== -1) {
            const start = Math.max(0, index - 30);
            const end = Math.min(content.length, index + query.length + 50);
            let snippet = content.substring(start, end);
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';
            matches.push({type: '正文', text: snippet});
          }
        }
        
        // 搜索分类
        if (post.categories) {
          post.categories.forEach(cat => {
            if (cat.toLowerCase().includes(lowerQuery)) {
              matches.push({type: '分类', text: cat});
            }
          });
        }
        
        // 搜索标签
        if (post.tags) {
          post.tags.forEach(tag => {
            if (tag.toLowerCase().includes(lowerQuery)) {
              matches.push({type: '标签', text: tag});
            }
          });
        }
        
        if (matches.length > 0) {
          results.push({
            post: post,
            matches: matches
          });
        }
      });
      
      displayResults(results, query);
    }
    
    // 显示结果
    function displayResults(results, query) {
      if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">未找到与 "' + escapeHtml(query) + '" 相关的内容</p>';
        return;
      }
      
      let html = '<p class="search-result-count">找到 ' + results.length + ' 条结果</p>';
      html += '<ul class="post-list">';
      
      results.forEach(function(result) {
        const post = result.post;
        const matches = result.matches;
        
        html += '<li class="post-item">';
        html += '<a href="' + post.url + '" class="post-link">';
        html += '<h3 class="post-title">' + highlightText(post.title, query) + '</h3>';
        
        // 显示匹配内容
        html += '<div class="search-matches">';
        matches.forEach(function(match) {
          html += '<p class="match-item"><span class="match-type">[' + match.type + ']</span> ' + highlightText(match.text, query) + '</p>';
        });
        html += '</div>';
        
        html += '<div class="post-meta">';
        html += '<span class="post-date">' + post.date + '</span>';
        if (post.categories && post.categories.length > 0) {
          html += ' <span class="category-tag">' + post.categories.join(', ') + '</span>';
        }
        html += '</div>';
        html += '</a></li>';
      });
      
      html += '</ul>';
      searchResults.innerHTML = html;
    }
    
    // 高亮匹配文本
    function highlightText(text, query) {
      if (!text) return '';
      const escaped = escapeHtml(text);
      const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
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
    
    // 监听输入 - 实时搜索
    searchInput.addEventListener('input', function(e) {
      search(e.target.value.trim());
    });
    
    // 如果 URL 有搜索参数
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      searchInput.value = queryParam;
      search(queryParam);
    }
  });
})();
