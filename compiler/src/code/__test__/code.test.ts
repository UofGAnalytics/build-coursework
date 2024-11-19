import {
  ignoreWhitespace,
  normalizeLineEndings,
  testProcessor,
  unindentStringAndTrim,
} from '../../test-utils/test-processor';

describe('code regex', () => {
  it('should replace fenced code blocks with alias', async () => {
    const { md, html } = await testProcessor(`
      ## a

      bbb

      \`\`\`sas
      %macro sortid(dsn);
        proc sort data = &dsn;
          by employee_id;
        run;
      %mend;
      \`\`\`

      ccc
    `);

    const expectedMd = unindentStringAndTrim(`
      ## a

      bbb

      ::codeBlock[0]

      ccc
    `);

    expect(normalizeLineEndings(unindentStringAndTrim(md))).toContain(
      normalizeLineEndings(expectedMd),
    );

    const expectedHtml = unindentStringAndTrim(`
      <h2 id="a"><a class="link" href="#a"><svg class="icon link-icon">
            <use href="#link-icon"></use>
          </svg></a>a</h2>
      <p>bbb</p>
      <div class="code-wrapper">
        <pre><code>%macro sortid(dsn);
        proc sort data = &#x26;dsn;
          by employee_id;
        run;
      %mend;</code></pre>
      </div>
      <p>ccc</p>
    `);

    expect(normalizeLineEndings(unindentStringAndTrim(html))).toBe(
      normalizeLineEndings(expectedHtml),
    );
  });

  it('should replace inline code blocks with alias', async () => {
    const { md, html } = await testProcessor(`
      ## a

      bbb \`e = mc2\` ccc
    `);

    const expectedMd = unindentStringAndTrim(`
      ## a

      bbb :codeBlock[0] ccc
    `);

    expect(normalizeLineEndings(unindentStringAndTrim(md))).toBe(
      normalizeLineEndings(expectedMd),
    );

    const expectedHtml = unindentStringAndTrim(`
      <h2 id="a"><a class="link" href="#a"><svg class="icon link-icon">
            <use href="#link-icon"></use>
          </svg></a>a</h2>
      <p>bbb <code>e = mc2</code> ccc</p>
    `);

    expect(normalizeLineEndings(unindentStringAndTrim(html))).toBe(
      normalizeLineEndings(expectedHtml),
    );
  });

  it('should NOT try to transform SAS code', async () => {
    const { md, html } = await testProcessor(`
      Let's look at a simple example.

      \`\`\`sas
      %macro sortid(dsn);
        proc sort data = &dsn;
          by employee_id;
        run;
      %mend;
      \`\`\`

      You can see this on the "proc sort" statement line (\`data = &dsn;\`)
    `);

    const expectedMd = ignoreWhitespace(`
      Let's look at a simple example.

      ::codeBlock[0]

      You can see this on the "proc sort" statement line (:codeBlock[1])
    `);

    expect(ignoreWhitespace(md)).toBe(expectedMd);

    const expectedHtml = ignoreWhitespace(`
      <p>Let's look at a simple example.</p>
      <div class="code-wrapper">
        <pre>
          <code>
            %macro sortid(dsn);
            proc sort data = &#x26;dsn;
              by employee_id;
            run;
            %mend;
          </code>
        </pre>
      </div>
      <p>You can see this on the "proc sort" statement line (<code>data = &#x26;dsn;</code>)</p>
    `);

    expect(ignoreWhitespace(html)).toBe(expectedHtml);
  });
});
