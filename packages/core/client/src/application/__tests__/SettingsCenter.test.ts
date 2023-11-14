import { Application } from '../Application';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('PluginSettingsManager', () => {
  let app: Application;

  const test = {
    title: 'test title',
    Component: () => null,
  };

  const test1 = {
    title: 'test1 title',
    Component: () => null,
  };

  const test2 = {
    title: 'test2 title',
    Component: () => null,
  };

  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet('pm:listEnabled').reply(200, {
      data: [],
    });
  });

  beforeEach(() => {
    app = new Application({});
  });

  it('basic use', () => {
    const name = 'test';

    app.pluginSettingsManager.add(name, test);

    const settingRes = { ...test, name };
    const getRes = {
      ...test,
      name,
      label: test.title,
      path: '/admin/settings/test',
      isAllow: true,
      aclSnippet: 'pm.test',
      key: name,
      children: undefined,
    };
    expect(app.pluginSettingsManager.getSetting('test')).toContain(settingRes);
    expect(app.pluginSettingsManager.get('test')).toContain(getRes);
    expect(app.pluginSettingsManager.hasAuth('test')).toBeTruthy();
    const list = app.pluginSettingsManager.getList();
    expect(list.length).toBe(1);
    expect(list[0]).toContain(getRes);
  });

  it('multi', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test2', test2);
    expect(app.pluginSettingsManager.get('test1')).toContain(test1);
    expect(app.pluginSettingsManager.get('test2')).toContain(test2);

    const list = app.pluginSettingsManager.getList();
    expect(list.length).toBe(2);
    expect(list[0]).toContain(test1);
    expect(list[1]).toContain(test2);
  });

  it('nested', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test1.test2', test2);
    expect(app.pluginSettingsManager.get('test1')).toContain(test1);
    expect(app.pluginSettingsManager.get('test1.test2')).toContain(test2);
    expect(app.pluginSettingsManager.get('test1').children.length).toBe(1);
    expect(app.pluginSettingsManager.get('test1').children[0]).toContain(test2);
  });

  it('remove', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test1.test2', test2);

    app.pluginSettingsManager.remove('test1');
    expect(app.pluginSettingsManager.get('test1')).toBeFalsy();
    expect(app.pluginSettingsManager.get('test1.test2')).toBeFalsy();
    expect(app.pluginSettingsManager.getList().length).toBe(0);
  });

  it('acl', () => {
    app.pluginSettingsManager.setAclSnippets(['!pm.test']);
    app.pluginSettingsManager.add('test', test);
    expect(app.pluginSettingsManager.get('test')).toBeFalsy();
    expect(app.pluginSettingsManager.hasAuth('test')).toBeFalsy();
    expect(app.pluginSettingsManager.get('test', false)).toContain({ ...test, isAllow: false });

    expect(app.pluginSettingsManager.getList().length).toBe(0);
    expect(app.pluginSettingsManager.getList(false).length).toBe(1);
    expect(app.pluginSettingsManager.getList(false)[0]).toContain({ ...test, isAllow: false });
  });

  it('has', () => {
    app.pluginSettingsManager.add('test', test);
    expect(app.pluginSettingsManager.has('test')).toBeTruthy();
    expect(app.pluginSettingsManager.has('test1')).toBeFalsy();
  });

  it('getAclSnippet', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test2', {
      ...test2,
      aclSnippet: 'any.string',
    });
    expect(app.pluginSettingsManager.getAclSnippet('test1')).toBe('pm.test1');
    expect(app.pluginSettingsManager.getAclSnippet('test2')).toBe('any.string');
  });

  it('getRouteName', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test1.test2', test2);
    expect(app.pluginSettingsManager.getRouteName('test1')).toBe('admin.settings.test1');
    expect(app.pluginSettingsManager.getRouteName('test1.test2')).toBe('admin.settings.test1.test2');
  });

  it('getRoutePath', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test1.test2', test2);
    expect(app.pluginSettingsManager.getRoutePath('test1')).toBe('/admin/settings/test1');
    expect(app.pluginSettingsManager.getRoutePath('test1.test2')).toBe('/admin/settings/test1/test2');
  });

  it('router', () => {
    app.pluginSettingsManager.add('test1', test1);
    app.pluginSettingsManager.add('test1.test2', test2);
    expect(app.router.getRoutes()[0]).toMatchInlineSnapshot(`
      {
        "children": undefined,
        "element": <AppNotFound />,
        "path": "*",
      }
    `);
  });
});
