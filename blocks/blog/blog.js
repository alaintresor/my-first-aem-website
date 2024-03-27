async function fetchData(jsonURL) {
  const response = await fetch(jsonURL);
  const data = await response.json();

  return data;
}

async function createListItems(jsonURL) {
  const { pathname } = new URL(jsonURL);
  const { data } = await fetchData(pathname);
  const listItems = data.map((item) => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = item.imageurl;
    img.alt = item.title;
    img.className = 'blog-card-image';
    const div = document.createElement('div');
    div.className = 'blog-card-body';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description;
    const link = document.createElement('a');
    link.href = new URL(item.articleurl).pathname;
    link.textContent = 'Read more';
    div.append(title, description, link);
    li.append(img, div);
    return li;
  });
  return listItems;
}

export default async function decorate(block) {
  const jsonURL = block.querySelector('a[href$=".json"]');
  const ul = document.createElement('ul');
  const listItems = await createListItems(jsonURL);
  listItems.forEach((li) => ul.appendChild(li));

  block.textContent = '';
  block.append(ul);
}
