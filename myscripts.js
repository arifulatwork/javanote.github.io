// Load JSON data and populate the sidebar with subtopics
fetch("notes.json")
    .then(response => response.json())
    .then(data => {
        const sidebarMenu = document.getElementById("sidebar-menu");

        data.topics.forEach(topic => {
            const listItem = document.createElement("li");
            listItem.textContent = topic.title;

            // Sub-menu for subtopics
            let subMenu;
            if (topic.subtopics) {
                subMenu = document.createElement("ul");
                subMenu.classList.add("sub-menu"); // Hidden by default

                topic.subtopics.forEach(subtopic => {
                    const subItem = document.createElement("li");
                    subItem.textContent = subtopic.title;
                    subItem.onclick = (event) => {
                        event.stopPropagation(); // Prevent parent click event
                        showContent(subtopic);
                    };
                    subMenu.appendChild(subItem);
                });

                listItem.appendChild(subMenu);
            }

            listItem.onclick = (event) => {
                event.stopPropagation(); // Prevent triggering parent's parent
                showContent(topic);

                // Toggle sub-menu visibility
                if (subMenu) {
                    subMenu.classList.toggle("visible");
                }
            };

            sidebarMenu.appendChild(listItem);
        });
    });

// Show content for topics and subtopics
function showContent(item) {
    const contentArea = document.getElementById("content-area");
    let content = `
        <div class="note-container">
            <h1 class="note-title">${item.title}</h1>
            ${item.description ? `<p class="note-description">${item.description}</p>` : ""}
    `;

    if (item.content) {
        item.content.forEach(entry => {
            content += `<p class="note-description">${entry.description}</p>`;

            // Add table if available
            if (entry.table) {
                content += `<table class="note-table"><thead><tr>`;
                entry.table.headers.forEach(header => {
                    content += `<th>${header}</th>`;
                });
                content += `</tr></thead><tbody>`;

                entry.table.rows.forEach(row => {
                    content += `<tr>`;
                    row.forEach(cell => {
                        content += `<td>${cell}</td>`;
                    });
                    content += `</tr>`;
                });

                content += `</tbody></table>`;
            }

            // Add code block after the table if available
            if (entry.code) {
                content += `<pre><code>${entry.code}</code></pre>`;
            }
        });
    }

    content += `</div>`;
    contentArea.innerHTML = content;
}
