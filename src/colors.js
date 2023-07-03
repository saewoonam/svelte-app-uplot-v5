/*
 // colormap crap before using web tools
    var colors = colormap
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    /*
    for (let counter=0; counter<40; counter++) {
        let rgb = colormap(counter/40);
        //console.log('rgb', rgb);
        let hex = rgbToHex(...rgb);
        //console.log('hex', hex);
        colors.push(hex);
    }
var colors = []
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
for (let counter=0; counter<20; counter++) {
    let rgb = tab20c(counter/20);
    //console.log('rgb', rgb);
    let hex = rgbToHex(...rgb);
    //console.log('hex', hex);
    colors.push(hex);
}
*/
var colors;

colors = [
    '#0000ff', '#2a17fa', '#3c25f4', '#492fef', '#5338ea', '#5c41e4',
    '#6348df', '#6a50d9', '#7057d4', '#755ece', '#7a64c8', '#7f6bc2',
    '#8371bc', '#8778b6', '#8b7eb0', '#8e84aa', '#928aa3', '#95909d',
    '#999696', '#9c9c8f', '#9fa187', '#a3a780', '#a7ac78', '#abb270',
    '#b0b767', '#b6bc5e', '#bcc055', '#c3c54a', '#cbc940', '#d3cd34',
    '#dcd029', '#e5d41f', '#edd815', '#f3dc0c', '#f8e105', '#fbe602',
    '#feec00', '#fff200', '#fff900', '#ffff00',
]
colors = [
    '#0000ff', '#3c24e7', '#4e34d3', '#593fc4', '#6148b7', '#6750ab',
    '#6c57a1', '#705e98', '#736490', '#776a89', '#7a7083', '#7c767d',
    '#7f7b78', '#828173', '#85866f', '#888b6b', '#8b9167', '#8e9664',
    '#929b61', '#95a05e', '#99a55c', '#9daa5a', '#a1ae58', '#a5b357',
    '#a9b856', '#adbd55', '#b2c155', '#b7c656', '#bccb57', '#c1cf58',
    '#c6d45a', '#ccd85d', '#d2dc60', '#d8e165', '#dee56a', '#e4e971',
    '#eaed79', '#f0f183', '#f7f592', '#fbf8ba']
colors = [
    '#00429d', '#0055b5', '#0069c8', '#007dd7', '#0091e1', '#00a4e8',
    '#06b6ec', '#11c7ed', '#1fd6ec', '#32e4eb', '#49eee9', '#65f7e8',
    '#84fde9', '#97fdea', '#99fae9', '#9cf6e8', '#9ff3e6', '#a3efe5',
    '#a7ebe3', '#abe7e1', '#b0e2de', '#b5dedb', '#badad8', '#c0d5d4',
    '#c6d1d0', '#cccccc', '#b4dad4', '#9de9d3', '#89f8c9', '#79ffb8',
    '#70ffa1', '#6eff86', '#73ff69', '#80ff4c', '#93ff32', '#adff1b',
    '#ccff0b', '#edff02', '#fff500', '#ffd900', '#ffb500', '#ff8e00',
    '#ff6800', '#ff4600', '#ff2800', '#ff1200', '#ff0300', '#ff0011',
    '#ff002a', '#cb0038' ]
// https://pair-code.github.io/colormap/curves/?colors=00429d-96ffea-cccccc-ffff00-93003a&numTicks=50&space=cubehelix&type=linear
colors = 
    ['#0000ff', '#2621ff', '#3933ff', '#4842ff', '#554fff', '#615bff',
        '#6c67ff', '#7773ff', '#827eff', '#8c89ff', '#9694ff', '#56a2ff',
        '#00afff', '#00bbff', '#00c5ff', '#00cdff', '#00d3e4', '#00d7bf',
        '#00d996', '#00da69', '#38d936', '#61d61f', '#7cd200', '#93cd00',
        '#a7c900', '#b9c400', '#c9be00', '#d8b800', '#e6b200', '#f3ac00',
        '#ffa500', '#f59500', '#eb8600', '#e17700', '#d56800', '#ca5900',
        '#be4a00', '#b23b00', '#a52c01', '#981a02', '#8b0000', '#9a1d18',
        '#a8312d', '#b64341', '#c25555', '#ce6669', '#d9787d', '#e48a91',
        '#ed9ca5', '#f6aeb8']
colors =
    ['#0000ff', '#2c26ff', '#413bff', '#524cff', '#615bff', '#6f6aff',
        '#7c78ff', '#8986ff', '#9694ff', '#38a5ff', '#00b5ff', '#00c3ff',
        '#00cdff', '#00d4db', '#00d8ab', '#00da75', '#38d936', '#68d518',
        '#88d000', '#a2ca00', '#b9c400', '#cdbd00', '#dfb500', '#f0ad00',
        '#ffa500', '#f39200', '#e67e00', '#d86c00', '#ca5900', '#bb4700',
        '#ab3401', '#9b1f02', '#8b0000', '#9e231d', '#af3a37', '#bf5050',
        '#ce6669', '#dc7c82', '#e8939b', '#f4a9b3']
// #5e00d1 #9694ff #5be845 #ffa500 #8b0000 #ffc0cb
colors = ['#5e00d1', '#6326d9', '#683be0', '#6e4ce6', '#755bec', '#7c6af2',
    '#8478f7', '#8d86fb', '#9694ff', '#38a5ff', '#00b5ff', '#00c3ff',
    '#00cdff', '#00d4db', '#00d8ab', '#00da75', '#38d936', '#68d518',
    '#88d000', '#a2ca00', '#b9c400', '#cdbd00', '#dfb500', '#f0ad00',
    '#ffa500', '#f39200', '#e67e00', '#d86c00', '#ca5900', '#bb4700',
    '#ab3401', '#9b1f02', '#8b0000', '#9e231d', '#af3a37', '#bf5050',
    '#ce6669', '#dc7c82', '#e8939b', '#f4a9b3' ]
// #ffc0cb #8b0000 #ffa500 #5be845 #9694ff #5e00d1
colors = ['#ffc0cb', '#f1a8b2', '#e29098', '#d4787f', '#c56066', '#b7484c',
    '#a83033', '#9a1819', '#8b0000', '#9a1500', '#a82900', '#b73e00',
    '#c55200', '#d46700', '#e27c00', '#f19000', '#ffa500', '#ebad09',
    '#d6b611', '#c2be1a', '#adc723', '#99cf2b', '#84d734', '#70e03c',
    '#5be845', '#62de5c', '#6ad374', '#71c88b', '#78bea2', '#80b4b9',
    '#87a9d0', '#8f9fe8', '#9694ff', '#8f82f9', '#886ff4', '#815dee',
    '#7a4ae8', '#7337e2', '#6c25dd', '#6513d7']

colors = ['#ffc0cb', '#ecb8b1', '#d4b09f', '#bba894', '#a49f8e', '#92958a',
    '#858985', '#797e7a', '#6a7763', '#656e47', '#696129', '#71520b',
    '#7c3d00', '#881b00', '#9b2000', '#b14000', '#c55e00', '#d87b00',
    '#e79900', '#f5b800', '#ffd700', '#ecdb00', '#d7de00', '#c2e100',
    '#abe415', '#91e629', '#73e73a', '#17e85d', '#00e69f', '#00dfda',
    '#00d4ff', '#00c6ff', '#00b2ff', '#7c9cff', '#8e89fc', '#8478f7',
    '#7a67f1', '#7255ea', '#6a42e2', '#642bda']

colors = ['#ffc0cb', '#e9b5be', '#d2aab1', '#bd9fa4', '#a79497', '#92898a',
    '#827d7c', '#896d66', '#8e5c50', '#8f4a3b', '#8f3726', '#8d1e11',
    '#921a02', '#a74301', '#bc6401', '#cf8500', '#e3a500', '#f6c600',
    '#f4d90e', '#dedd1e', '#c6e02a', '#ace333', '#8fe63b', '#6ae743',
    '#6edf61', '#81d184', '#8ec3a3', '#95b5c0', '#98a6dd', '#9797fa',
    '#9083f9', '#886ff1', '#7f5ae9', '#7545e1', '#6a2cd9']

colors = ['#00008b', '#0605ff', '#1210ff', '#221fff', '#3632ff', '#4c48ff',
    '#6461ff', '#7d7aff', '#9694ff', '#7b9fff', '#60adf7', '#47bae6',
    '#33c7cc', '#26d2ab', '#22d985', '#28dc5d', '#38d936', '#48d923',
    '#5bd713', '#72d305', '#8ccd00', '#a8c500', '#c5bb00', '#e2b100',
    '#ffa500', '#ff8a00', '#ff6f00', '#ff5500', '#fd3d00', '#ed2800',
    '#d51600', '#b40900', '#8b0000', '#ba090e', '#dc1922', '#f32d3a',
    '#ff4556', '#ff6173', '#ff7f91', '#ff9faf']

colors = ['#808080', '#5b8078', '#007e81', '#007a99', '#0073b8', '#0068d5',
    '#0055e3', '#2b2cda', '#5e26d8', '#5f42e2', '#6358ea', '#696cf1',
    '#727ef6', '#7e90fb', '#8ca2fe', '#83b1ff', '#00bcff', '#00c7ff',
    '#00cffe', '#00d4dd', '#00d7ae', '#00d777', '#38d336', '#6acf17',
    '#8bcb00', '#a6c500', '#bebf00', '#d4b800', '#e8b000', '#f9a800',
    '#f69700', '#e88200', '#da6d00', '#ca5900', '#ba4500', '#a93001',
    '#971802', '#920f0c', '#a62e29', '#b84644', '#c95e60', '#d8767b',
    '#e68f96', '#f3a7b1']
// https://pair-code.github.io/colormap/curves/?colors=5e00d1-9694ff-ffd696-ff704f-8b0000&numTicks=35&space=hsl&type=basis
 colors = ['#5e00d1', '#5c00e7', '#5700fd', '#5613ff', '#5428ff', '#513bff',
     '#4d4eff', '#5d75ff', '#6b9bff', '#77bfff', '#80e3ff', '#87fff9',
     '#8cffd8', '#8fffb7', '#91ff96', '#abff90', '#c9ff8f', '#e5ff8c',
     '#feff88', '#ffe983', '#ffd47d', '#ffc276', '#ffb06d', '#ff9f64',
     '#ff8e59', '#ff7d4c', '#ff6c3e', '#ff592f', '#ff441d', '#ff2e0b',
     '#f71c00', '#e21400', '#cd0e00', '#b70800', '#a10300']

colors = ['#ffd700', '#f0b647', '#df9565', '#cc737a', '#b6518d', '#9c289e',
    '#8200ae', '#8829bc', '#8c45ca', '#905cd8', '#9371e7', '#9586f5',
    '#9699f5', '#93a6d5', '#8cb2b6', '#7fbe96', '#6dc974', '#50d44e',
    '#51d948', '#74d965', '#8ed880', '#a5d799', '#bad6b2', '#cdd4cb',
    '#d0bdb9', '#c89d92', '#be7d6d', '#b15d4a', '#a13c29', '#8e0f07',
    '#ab0c1f', '#d21c3f', '#fa2c61', '#ff3b84', '#ff4ba9']
// https://pair-code.github.io/colormap/curves/?colors=ffd700-8100ac-9694ff-38d936-d3d3d3-8b0000-ff5bcf&numTicks=40&space=lab&type=linear
colors = ['#ffd700', '#f2bb43', '#e39f5e', '#d38373', '#c16784', '#ac4994',
    '#9428a3', '#8314b0', '#8732bc', '#8c47c8', '#8f5ad5', '#926ce1',
    '#947dee', '#968efb', '#969ced', '#92a7d1', '#8cb2b6', '#81bc9a',
    '#72c67d', '#5dd05e', '#38d936', '#5fd953', '#7bd96c', '#91d883',
    '#a5d799', '#b7d6af', '#c8d4c5', '#d2c9c7', '#cdada5', '#c59184',
    '#bb7565', '#af5946', '#a13c29', '#91170c', '#980b18', '#ab1a34',
    '#bd2751', '#cf346f', '#df418e', '#f04eae']

colors = ['#ffd700', '#f0b747', '#df9764', '#cb777a', '#b5568d', '#9c329e',
    '#820cae', '#8732bc', '#8c4aca', '#905fd8', '#9373e7', '#9587f5',
    '#9699f5', '#93a6d5', '#8cb2b6', '#7fbe96', '#6dc974', '#50d44e',
    '#51d948', '#74d965', '#8ed880', '#a5d799', '#bad6b2', '#cdd4cb',
    '#d0bdb9', '#c89d92', '#be7d6d', '#b15d4a', '#a13c29', '#8e0f07',
    '#9d1020', '#b32040', '#c72f62', '#db3d85', '#ed4ca9']

colors = ['#5e00d1', '#6621d6', '#6e35dc', '#7545e1', '#7c53e6', '#8261eb',
    '#886ff1', '#8d7df6', '#928afb', '#9696fa', '#959fe5', '#92a8d0',
    '#8db0bb', '#86b8a6', '#7dc091', '#71c77a', '#60ce62', '#49d647',
    '#52d734', '#75d22f', '#8fce2a', '#a5c925', '#b9c320', '#cbbd1a',
    '#dcb613', '#ecaf0b', '#fba702', '#f59900', '#e88801', '#da7801',
    '#cd6701', '#c05702', '#b34602', '#a53402', '#982002']
exports.colors = colors
