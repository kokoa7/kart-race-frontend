const fs = require('fs');
const axios = require('axios');
const path = require('path');

// 基本URL
const BASE_URL = 'https://www.rentalkart.jp';

// 現在の日付をYYYY-MM-DD形式で取得
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// 静的ページのリスト
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/tracks', changefreq: 'weekly', priority: '0.8' },
  { url: '/new-race', changefreq: 'monthly', priority: '0.5' },
  { url: '/new-track', changefreq: 'monthly', priority: '0.5' },
];

// サイトマップXMLを生成する関数
async function generateSitemap() {
  try {
    console.log('サイトマップの生成を開始します...');
    
    // 動的ページ（サーキット詳細ページ）のデータを取得
    const tracksResponse = await axios.get('https://kart-race-api.onrender.com/tracks');
    const tracks = tracksResponse.data;
    
    // XMLヘッダーとurlsetの開始タグ
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 静的ページをサイトマップに追加
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // 動的ページ（サーキット詳細ページ）をサイトマップに追加
    tracks.forEach(track => {
      sitemap += `  <url>
    <loc>${BASE_URL}/track/${track.id}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // レース編集ページは検索エンジンにインデックスさせない方が良いため、含めない

    // urlsetの終了タグ
    sitemap += `</urlset>`;

    // publicフォルダにsitemap.xmlを書き込む
    fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
    
    console.log('サイトマップの生成が完了しました！');
  } catch (error) {
    console.error('サイトマップの生成中にエラーが発生しました:', error);
  }
}

// スクリプトを実行
generateSitemap(); 