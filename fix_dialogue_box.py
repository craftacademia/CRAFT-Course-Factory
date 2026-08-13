path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    content = f.read()

old = """.dialogue-box--plain {
    position:absolute;
    left:10%;
    right:10%;
    bottom:2%;
    background:#ffffff;
    border:3px solid #d71920;
    border-radius:16px;
    padding:14px 18px;
    z-index:10;
    box-shadow:0 4px 16px rgba(0,0,0,0.25);
}
.speech-bubble {
    position:absolute;
    bottom:8%;
    width:55%;
    background:#ffffff;
    border:3px solid #d71920;
    border-radius:50%;
    padding:28px 40px;
    z-index:10;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:90px;
    box-sizing:border-box;
}
.speech-bubble--right {
    right:3%;
    left:auto;
}
.speech-bubble--left {
    left:3%;
    right:auto;
}
.speech-bubble--right::before {
    content:'';
    position:absolute;
    left:-32px;
    top:50%;
    transform:translateY(-50%);
    border-width:14px 32px 14px 0;
    border-style:solid;
    border-color:transparent #d71920 transparent transparent;
}
.speech-bubble--right::after {
    content:'';
    position:absolute;
    left:-26px;
    top:50%;
    transform:translateY(-50%);
    border-width:11px 26px 11px 0;
    border-style:solid;
    border-color:transparent #ffffff transparent transparent;
}
.speech-bubble--left::before {
    content:'';
    position:absolute;
    right:-32px;
    top:50%;
    transform:translateY(-50%);
    border-width:14px 0 14px 32px;
    border-style:solid;
    border-color:transparent transparent transparent #d71920;
}
.speech-bubble--left::after {
    content:'';
    position:absolute;
    right:-26px;
    top:50%;
    transform:translateY(-50%);
    border-width:11px 0 11px 26px;
    border-style:solid;
    border-color:transparent transparent transparent #ffffff;
}
.speech-bubble-text {
    font-size:17px;
    line-height:1.5;
    color:#222;
    text-align:center;
}"""

new = """.dialogue-box {
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    background:#ffffff;
    border-top:4px solid #f59e0b;
    padding:14px 24px;
    z-index:10;
    box-sizing:border-box;
}"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)
print('Done')
