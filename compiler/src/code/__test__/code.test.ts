import {
  ignoreWhitespace,
  testProcessor,
} from '../../test-utils/test-processor';

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
  `);

  const expectedMd = ignoreWhitespace(`
    Let's look at a simple example.

    ::codeBlock[0]
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
  `);

  expect(ignoreWhitespace(html)).toBe(expectedHtml);
});
