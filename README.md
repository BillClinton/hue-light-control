# hue-light-control

A web component that allows one to add hue light controls to their html pages.

Simple Usage: `<light-control data-id="35"></light-control>`

# Description

## What are web components?

The simple answer is web components are custom HTML elements which can be used as desired in your user interface.

## Using the hue-light-control in your own local web application.

### Step 1: Know the local IP of your Hue bridge

An easy way to find the IP address of your bridge is to open the Hue app on your phone or tablet, go to `Settings >> Bridge Settings` and it will be listed there. But if you have trouble finding it there, the "get started" guide on the Hue developer site lists several other methods: https://developers.meethue.com/develop/get-started-2/

### Step 2: Get an authorized user token from your Hue bridge

Once you have the local IP address of your bridge, you can use Hue's clip tool to get an API authorization token. Go to this address in your browser, using your Hue bridge's IP address:

`https://<bridge ip address>/debug/clip.html`

Enter these values in the form and press the POST button:

```
URL:	/api
Body:	{"devicetype":"my_hue_app#iphone peter"}
Method:	POST
```

You can put your own identifying string for the _devicetype_ property.

Press the button on your Hue bridge and then press the POST button again and you should get a success response like below. This lets your Hue bridge know that you have actual physical access to your bridge before you are granted an authorization token.

![clip tool](https://developers.meethue.com/wp-content/uploads/2018/02/SuccessResponse-1.png)

The "username" value is your token that should be put in the data-key attribute of the hue-config element:

```
    <hue-config
      data-ip="192.168.1.100"
      data-key="1028d66426293e821ecfd9ef1a0731df"
    ></hue-config>
```

Once you have your IP and your username token (key), you are ready to go. Store your authorization token in a secure place and you should only need to do this once.

### Step 3: Get the `<light-control>` component

Grab the latest release and include it in your document's head.

```
  <head>
    <title>My Home UI</title>
    <script src="hue-light-control.js" defer type="module"></script>
  </head>
```

- Note: your web page must be served by a server for this to work. This will not work in a local html file that you open in your browser. If you attempt it, you will get CORS errors because security restrictions prevent loading JavaScript files as a module locally, and this must be run as a module.

Add the configuration element somewhere in your document's body. This element has no dimensions and will not be visible on your page.

```
    <hue-config
      data-ip="192.168.1.100"
      data-key="xxxxxxxxxxxxxxx"
    ></hue-config>
```

You must add the IP address of your Hue Bridge and the API token from your bridge.

I think the easiest way to find the IP address of your bridge is to open the Hue app on your phone or tablet, go to Settings >> Bridge Settings and it will be listed there. But if you have trouble finding it there, the "get started" guide on the Hue developer site lists several other methods: https://developers.meethue.com/develop/get-started-2/

Once you have the local IP address of your bridge, you can use Hue's clip tool to get an API token. Go to this address in your browser, using your Hub's IP address:

`https://<bridge ip address>/debug/clip.html`

Enter these values in the form and press the POST button:

```
URL:	/api
Body:	{"devicetype":"my_hue_app#iphone peter"}
Method:	POST
```

You can put your own identifying string for the _devicetype_ property.

Press the button on the bridge and then press the POST button again and you should get a success response like below. This lets Hue know you have actual physical access to your bridge before they give you an access token.

![clip tool](https://developers.meethue.com/wp-content/uploads/2018/02/SuccessResponse-1.png)

The "username" value is your token that should be put in the data-key attribute of the hue-config element:

```
    <hue-config
      data-ip="192.168.1.100"
      data-key="1028d66426293e821ecfd9ef1a0731df"
    ></hue-config>
```

Once you have your IP and your username token (key), you are ready to go. You should only have to do this stuff once!

### Adding Hue controls to your webpage

Once you have the configuration element set up, you can start adding light controls to your webpage. You need to specify the HUE API ID for the light you are adding to your document as the "data-id". This attribute is required.

`<light-control data-id="35"></light-button>`

If you wish, you can override the name of the light:

`<light-control data-id="35">Custom Light Name</light-button>`

If you are unsure of the IDs of your lights, include the light-list component in your page for a quick reference:

`<light-list></light-list>`

The `<light-list>` component is only intended to serve as a developmental tool for people who might not be familiar with examining the Fetch responses in the network tab of the dev tool. It would most likely serve no real purpose in your final app.

### Anatomy of the light-control element

The `<light-control>` element consists of three native HTML elements, inside a `<fieldset>` element with a class name of `.wrapper`:

- button - serves as an on/off switch
- range input - adjust brightness of the light
- color picker - changes the color of the light

You can feel free to style these elements anyway you would like.
