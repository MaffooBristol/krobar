<td class='cell-index'>-</td>
<% if (title && artist) { %>
  <td class='cell-artist' style='font-weight:bold'><%= artist %></td>
  <td class='cell-title' style='font-weight:bold'><%= title %></td>
<% } else { %>
  <td class='cell-filename' colspan='2'><%- file %></td>
<% } %>
<td class='cell-key'><%- key %></td>
<td class='cell-bpm'><%- bpm %></td>
<td class='cell-rating'><%- rating %></td>
<td class='cell-playtime'><%- playtime %></td>
<td class='cell-loudness' style='background-color: rgba(<%- 122 + (loudness * 20) %>, <%- 122 - (loudness * 20) %>, 0);'><%- Math.round(loudness) %></td>
<td class='cell-release-date'><%- release_date %></td>
<% if (gap) { %><td class='cell-gap'>GAP!!</td><% } %>
