function *tagging(iter, separator) {
    let isTag = false;
    let tagIdx = 0;
    
    for (const msg of iter) {
        if (separator === msg) {
            isTag = !isTag;
        } else {
            yield {isTag, tagIdx, msg};
            if (isTag) {
                tagIdx += 1;
            }
        }
    }
}

function *elementBuilder(iter, elProps, element) {
    let tag;

    for (const { isTag, tagIdx, msg } of iter) {
        if (isTag) {
            const prop = Array.isArray(elProps) && elProps[tagIdx] ? elProps[tagIdx] : elProps;
            const el = Array.isArray(element) && element[tagIdx] ? element[tagIdx] : element;
            tag = document.createElement(el);
            Object.keys(prop).forEach((key) => {
                tag.setAttribute(key, prop[key]);
            })
            tag.innerText = msg;
            yield tag;
        } else if (msg) {
            tag = document.createElement('div');
            tag.innerText = msg;
            yield tag;
        }
    }
}

function parser({ message = '', elProps = {}, element = 'a', separator = '$L' }) {
    const reg = new RegExp(`(\\${separator})`, 'g');
    const splittedMsgs = message.split(reg);
    const taggedMsgs = [...tagging(splittedMsgs, separator)];

    return [...elementBuilder(taggedMsgs, elProps, element)];
}

const message = 'Transfer to $L${receiver_name}$L a $Laa$L $Lfsdfdsfsdfsd$L';
const htmls = parser({ message, elProps: {className: 'text'}, element: 'b' });
//{ message, elProps: [{className: 'text'}, {className: 'texts'}], element: ['a', 'b']}

const elApp = document.getElementById('app');
htmls.forEach((htm) => {
    elApp.appendChild(htm);
});

