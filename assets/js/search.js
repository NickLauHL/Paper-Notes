// 全文搜索功能 - 无限制显示所有匹配
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
    
    // 查找所有匹配位置 - 无限制
    function findAllMatches(text, query) {
      const matches = [];
      if (!text || !query) return matches;
      
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      let startIndex = 0;
      
      while (true) {
        const index = lowerText.indexOf(lowerQuery, startIndex);
        if (index === -1) break;
        
        // 提取上下文
        const contextStart = Math.max(0, index - 40);
        const contextEnd = Math.min(text.length, index + query.length + 60);
        let snippet = text.substring(contextStart, contextEnd);
        if (contextStart > 0) snippet = '...' + snippet;
        if (contextEnd < text.length) snippet = snippet + '...';
        
        matches.push(snippet);
        startIndex = index + 1;
        
        // 无限制，显示所有匹配
      }
      
      return matches;
    }
    
    // 搜索函数 - 无限制搜索所有内容
    function search(query) {
      if (!query || query.length < 1) {
        searchResults.innerHTML = '<p class="no-results">请输入关键词开始搜索</p>';
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = [];
      
      posts.forEach(post => {
        let allMatches = [];
        
        // 搜索标题
        if (post.title && post.title.toLowerCase().includes(lowerQuery)) {
          allMatches.push({type: '标题', text: post.title});
        }
        
        // 搜索完整正文 - 找所有匹配，无限制
        if (post.fullContent) {
          const contentMatches = findAllMatches(post.fullContent, query);
          contentMatches.forEach(match => {
            allMatches.push({type: '正文', text: match});
          });
        }
        
        // 搜索分类
        if (post.categories) {
          post.categories.forEach(cat => {
            if (cat.toLowerCase().includes(lowerQuery)) {
              allMatches.push({type: '分类', text: cat});
            }
          });
        }
        
        // 搜索标签
        if (post.tags) {
          post.tags.forEach(tag => {
            if (tag.toLowerCase().includes(lowerQuery)) {
              allMatches.push({type: '标签', text: tag});
            }
          });
        }
        
        // 只要有匹配就加入结果，无限制
        if (allMatches.length > 0) {
          results.push({
            post: post,
            matches: allMatches,
            matchCount: allMatches.length
          });
        }
      });
      
      displayResults(results, query);
    }
    
    // 显示结果 - 全部显示，无限制
    function displayResults(results, query) {
      if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">未找到与 "' + escapeHtml(query) + '" 相关的内容</p>';
        return;
      }
      
      // 计算总匹配数
      let totalMatches = 0;
      results.forEach(r => totalMatches += r.matchCount);
      
      let html = '<p class="search-result-count">在 ' + results.length + ' 篇文章中找到 ' + totalMatches + ' 处匹配</p>';
      html += '<ul class="post-list">';
      
      // 显示所有结果，无限制
      results.forEach(function(result) {
        const post = result.post;
        const matches = result.matches;
        
        html += '<li class="post-item" style="margin-bottom: 20px;">';
        html += '<a href="' + post.url + '" class="post-link">';
        html += '<h3 class="post-title">' + highlightText(post.title, query) + ' <span style="font-size: 14px; color: #888;">(' + matches.length + ' 处匹配)</span></h3>';
        
        // 显示所有匹配内容，无限制
        html += '<div class="search-matches" style="margin: 10px 0;">';
        matches.forEach(function(match, index) {
          html += '<p style="margin: 5px 0; padding: 8px; background: #f8f9fa; border-left: 3px solid #3182ce; border-radius: 4px; font-size: 14px;">';
          html += '<span style="color: #805ad5; font-weight: bold; margin-right: 8px;">[' + match.type + ']</span>';
          html += highlightText(match.text, query);
          html += '</p>';
        });
        html += '</div>';
        
        html += '<div class="post-meta">';
        html += '<span class="post-date">' + post.date + '</span>';
        if (post.categories && post.categories.length > 0) {
          html += ' <span class="category-tag">' + post.categories.join(', ') + '</span>';
        }
        if (post.tags && post.tags.length > 0) {
          html += ' <span style="color: #3182ce;">' + post.tags.join(', ') + '</span>';
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
      return escaped.replace(regex, '<mark style="background: #fff59d; padding: 1px 2px;">$1</mark>');
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
